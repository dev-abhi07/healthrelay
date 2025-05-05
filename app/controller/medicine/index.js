const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const Address = require("../../models/address");
const cart = require("../../models/cart");
const Order = require("../../models/order");
const OrderItem = require("../../models/orderItem");
const Promotions = require("../../models/promotion");
const users = require("../../models/users");


exports.medicineList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20; 
    const offset = (page - 1) * limit;

    const search = req.body.search ? req.body.search.trim() : "";


    let whereClause = "";
    if (search) {
      whereClause = `WHERE "ItemName" LIKE :search`;
    }

    const medicinesQuery = `
      SELECT *
      FROM medicine
      ${whereClause}
      LIMIT :limit
      OFFSET :offset
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM medicine
      ${whereClause}
    `;

    const [medicines] = await sequelize.query(medicinesQuery, {
      replacements: {
        search: `%${search}%`,
        limit,
        offset,
      },
    });

    const [countResult] = await sequelize.query(countQuery, {
      replacements: {
        search: `%${search}%`,
      },
    });

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);
    const hasMore = page < totalPages;

    return Helper.response(
      true,
      "Medicine List fetched successfully",
      {
        page,
        limit,
        totalRecords,
        totalPages,
        hasMore,
        medicines,
      },
      res,
      200
    );
  } catch (err) {
    return Helper.response(false, err.message, {}, res, 500);
  }
};



exports.medicineById = async(req,res)=>{
  try {
    const {medicineId}= req.body
    console.log(medicineId)

    const [medicine] = await sequelize.query(`
      SELECT *
      FROM medicine
      WHERE "Id" = ${medicineId}
    `);

    if (medicine.length === 0) {
      return Helper.response(false, "Medicine not found", {}, res, 404);
    }

    return Helper.response(true, "Medicine fetched successfully", medicine[0], res, 200);
  } catch (err) {
    return Helper.response(false, err.message, {}, res, 500);
  }
}

exports.addToCart = async(req,res)=>{
  try {
    const {medicineId, quantity} = req.body
    const [medicine] = await sequelize.query(`
      SELECT *
      FROM medicine
      WHERE "Id" = ${medicineId}
    `);

    if (medicine.length === 0) {
      return Helper.response(false, "Medicine not found", {}, res, 200);
    }
    
    const existingCartItem = await cart.findOne({
      where: {
        medicineId: medicineId,
        userId:req.users.id,
      },
    })
    if(existingCartItem) {
      return Helper.response(false, "Medicine already exists in cart", {}, res, 200);
    
      }
    
    

    const cartItems = await cart.create({
      medicineId: medicineId,
      userId:req.users.id,
      quantity: quantity || 1,
      price: medicine[0]?.MRP || 0,
    })
    if(!cartItems) {
      return Helper.response(false, "Failed to add medicine to cart", {}, res, 200);
    }






    return Helper.response(true, "Medicine added to cart successfully", {}, res, 200);
  } catch (err) {
    console.error("Add to Cart Error:", err);
    return Helper.response(false, err.message, {}, res, 500);
  }
}

exports.getCart = async(req,res)=>{
  try {
    const cartItems = await cart.findAll({
      where: {
        userId:req.users.id,
      },
    });

    const data = await Promise.all(
      cartItems.map(async (item) => {
        const [medicine] = await sequelize.query(`
          SELECT *
          FROM medicine
          WHERE "Id" = ${item.medicineId}
        `);
        const user = await users.findOne({
          where: {
            id: item.userId,
          },
          attributes: ["name"],
        })
        return {
          ...item.dataValues,
          medicine: medicine[0]?.ItemName || '',
          package: medicine[0]?.Pack_Type || '',
          username: user?.name || '',
          price: medicine[0]?.MRP || 0,
          total_price: medicine[0]?.MRP * item.quantity || 0,
        };
      })
    )

    const cartPrice = data.reduce((acc, item) => acc + item.total_price, 0).toFixed(2);


    if (cartItems.length === 0) {
      return Helper.response(false, "No items in cart", {}, res, 200);
    }

    return Helper.response(true, "Cart items fetched successfully",{cartItems:data,cartPrice}, res, 200);
  } catch (err) {  
    return Helper.response(false, err.message, {}, res, 500);
  }
}
exports.orderSummary = async (req, res) => {
  try {
    const { promotionCode } = req.body;

    const cartItems = await cart.findAll({
      where: { userId: req.users.id },
    });

    if (cartItems.length === 0) {
      return Helper.response(false, "No items in cart", {}, res, 200);
    }

    let totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let appliedPromotion = null;
    let discountAmount = 0;

    if (promotionCode) {
      const promotion = await Promotions.findOne({
        where: {
          id: promotionCode,
          is_active: true,
        },
      });

      if (promotion) {
        let calculatedDiscount = 0;

        if (promotion.discountType === 'fixed') {
          calculatedDiscount = promotion.discountValue;
        } else if (promotion.discountType === 'percentage') {
          calculatedDiscount = (totalAmount * promotion.discountValue) / 100;
        }

        if (calculatedDiscount < totalAmount) {
          discountAmount = calculatedDiscount;
          appliedPromotion = promotion;
        }
      }
    }

    const finalTotal = totalAmount - discountAmount;

    for (const item of cartItems) {
      const itemTotal = item.price * item.quantity;

      let itemDiscount = 0;
      if (appliedPromotion) {
        if (appliedPromotion.discountType === 'fixed') {
          itemDiscount = (itemTotal / totalAmount) * discountAmount;
        } else if (appliedPromotion.discountType === 'percentage') {
          itemDiscount = (itemTotal * appliedPromotion.discountValue) / 100;
        }

        itemDiscount = Math.min(itemDiscount, itemTotal);
      }

      const itemFinal = itemTotal - itemDiscount;

      await item.update({
        totalPrice: itemTotal.toFixed(2),
        discountAmount: itemDiscount.toFixed(2),
        finalPrice: itemFinal.toFixed(2),
        promotionId: appliedPromotion?.id || null,
      });
    }

    const orderSummary = {
      cartPrice: totalAmount.toFixed(2),
      promotionUsed: appliedPromotion?.code || null,
      discountApplied: discountAmount.toFixed(2),
      totalAmount: finalTotal.toFixed(2),
    };

    return Helper.response(true, "Order summary fetched successfully", orderSummary, res, 200);

  } catch (err) {
    return Helper.response(false, err.message, {}, res, 500);
  }
};



exports.deleteCartItem = async(req,res)=>{
  try {
    const {cartId} = req.body
    const cartItem = await cart.destroy({
      where: {
        id: cartId,
        userId: req.users.id,
      },
    });

    if (!cartItem) {
      return Helper.response(false, "Failed to delete cart item", {}, res, 200);
    }

    return Helper.response(true, "Cart item deleted successfully", {}, res, 200);
  } catch (err) {
    return Helper.response(false, err.message, {}, res, 500);
  }
}

exports.updateCartItem = async(req,res)=>{
  try {
    const {cartId, quantity} = req.body
    const cartItem = await cart.update({
      quantity: quantity,
    },{
      where: {
        id: cartId,
        userId: req.users.id,
      },
    });

    if (!cartItem) {
      return Helper.response(false, "Failed to update cart item", {}, res, 200);
    }

    return Helper.response(true, "Cart item updated successfully", {}, res, 200);
  } catch (err) {
    return Helper.response(false, err.message, {}, res, 500);
  }
}


exports.checkout = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const userId = req.users.id;
    const {addressId}= req.body
    const cartItems = await cart.findAll({
      where: { userId },
      transaction: t,
    });

    if (cartItems.length === 0) {
      return Helper.response(false, "Cart is empty", {}, res, 200);
    }

    let totalAmount = 0;
    let discountAmount = 0;

    for (const item of cartItems) {
      totalAmount += item.finalPrice || (item.price * item.quantity);
      discountAmount += item.discountAmount || 0;
    }
    const order = await Order.create({
      userId,
      orderNum:Helper.generateOrderNum(),
      totalAmount: totalAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      promotionId: cartItems[0].promotionId || null,
      addressId:addressId
    }, { transaction: t });

    
    const orderItemsPayload = cartItems.map(item => ({
      orderId: order.id,
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

    await cart.destroy({
      where: { userId },
      transaction: t,
    });

    await t.commit();

    return Helper.response(true, "Checkout successful", { orderId: order.orderNum }, res, 200);
  } catch (err) {
    console.log(err)
    await t.rollback();
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.orderList = async(req,res)=>{
  try{
    const formatted = {
      pending: [],
      completed: [],
    };
    let orders
    const userId = req.users.id;
   if(req.users.role === 'admin'){
    orders = await Order.findAll({
      order:[['createdAt','DESC']]
    })
   }else{
    orders = await Order.findAll({
      where:{
        userId:userId,
      },
      order:[['createdAt','DESC']]
    })
   }

    if(!orders){
      return Helper.response(false, "Order not found", {}, res, 200);
    }
    const data = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.findAll({
          where: {
            orderId: order.id,
          },
        });
    
        const addressDetails = await Address.findOne({
          where: {
            id: order.addressId,
          },
          attributes: ['addressLine1', 'state', 'city', 'postalCode'],
        });
        const userDetails = await users.findOne({
          where:{
            id:order.userId
          },
          attributes:['name']
        })
        const enrichedItems = await Promise.all(
          orderItems.map(async (item) => {
            const [medicineResult] = await sequelize.query(`
              SELECT "ItemName" FROM medicine WHERE "Id" = ${item.medicineId}
            `);
            const medicineName = medicineResult?.[0]?.ItemName || 'Unknown';
            return {
              ...item.dataValues,
              medicineName,
            };
          })
        );
    
        const value = {
          ...order.dataValues,
          customer_name:userDetails?.name,
          address: `${addressDetails?.addressLine1 || ''} ${addressDetails?.city || ''} ${addressDetails?.state || ''} ${addressDetails?.postalCode || ''}`,
          items: enrichedItems,
        };
    
        if (order.status === 'pending' || order.status === 'cancelled') {
          formatted.pending.push(value);
        } else{
          formatted.completed.push(value);
        }
      })
    );
    
    return Helper.response(true, "Order List found successfully!",formatted, res, 200);



  }catch(err){
    return Helper.response(false, err.message, {}, res, 500);
  }
}

exports.orderDetails = async(req,res)=>{
  try{
    const {orderId} = req.body
    const userId = req.users.id;
    const order = await Order.findOne({
      where:{
        id:orderId,
        userId:userId,
      }
    })
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: order?.id,
      },
    });

    const orderAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const orderJson = order.toJSON()
    const addressDetails = await Address.findOne({
      where: {
        id: orderJson.addressId,
      },
    });

    const promotionDetails = await Promotions.findOne({
      where:{
        id:orderJson.promotionId
      }
    })

    const orderData = {
      ...orderJson,
      address:addressDetails,
      coupon:promotionDetails,
      orderAmount:orderAmount
    };

  


    if(!order){
      return Helper.response(false, "Order not found", {}, res, 200);
    }


    const data = await Promise.all(
      orderItems.map(async(order)=>{
        const [medicineResult] = await sequelize.query(`
          SELECT * FROM medicine WHERE "Id" = ${order.medicineId}
        `);
        return {
          ...order.dataValues,
          medicineName: medicineResult?.[0]?.ItemName || 'Unknown',
          Pack_Type:medicineResult?.[0]?.Pack_Type,
          Description:medicineResult?.[0]?.Description,
          price:medicineResult?.[0]?.MRP,
        }
      })
    )
    return Helper.response(true, "Order Details found successfully!", {order:orderData, orderItems:data}, res, 200);


  }catch(err){
    console.log(err)
    return Helper.response(false, err.message, {}, res, 500);
  }
}

exports.cancelOrder = async(req,res)=>{
  try{
    const {orderId,remark} = req.body
    if(!orderId){
      return Helper.response(false,'order id is required',{},res,200)
    }

    const update = {
      status:'cancelled',
      remark:remark
    }

    const updateOrder = await Order.update(update,{
      where:{
        id:orderId
      }
    })

    if(!updateOrder){
      return Helper.response(false,'your order is not updated',{},res,200)
    }

    return Helper.response(true,'your order is cancelled successfully',{},res,200)

 

  }catch(err){
   
    return Helper.response(false,err.message,{},res,200)
  }
}

exports.reOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.users.id;
    const orderItems = await OrderItem.findAll({
      where: { orderId: orderId },
    });

    for (const item of orderItems) {
      const existingCartItem = await cart.findOne({
        where: {
          userId: userId,
          medicineId: item.medicineId,
        },
      });

      if (existingCartItem) {
        await existingCartItem.update({
          quantity: existingCartItem.quantity + item.quantity,
        });
      } else {
       
        await cart.create({
          userId: userId,
          medicineId: item.medicineId,
          quantity: item.quantity,
          price:item.price
        });
      }
    }

    return Helper.response(true, "Reordered items added to cart", {}, res, 200);

  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};












