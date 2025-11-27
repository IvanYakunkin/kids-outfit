import { GetOrdersDto } from '../dto/get-orders.dto';
import { Order } from '../entities/order.entity';

export function mapAllOrders(order: Order): GetOrdersDto {
  return {
    id: order.id,
    address: order.address,
    createdAt: order.createdAt,
    total: order.total.toString(),

    status: {
      id: order.status.id,
      name: order.status.name,
    },

    user: {
      id: order.user.id,
      firstname: order.user.firstname,
      middlename: order.user.middlename || null,
      lastname: order.user.lastname,
      phone: order.user.phone,
      isAdmin: order.user.isAdmin,
      created_at: order.user.created_at,
    },
  };
}
