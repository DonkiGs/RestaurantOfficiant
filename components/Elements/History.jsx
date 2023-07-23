import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button} from 'react-native';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/ru-RU'; // Добавьте этот импорт для локали ru-RU

const History = ({ employeeId }) => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://192.168.0.102:3000/orders/${employeeId}`);
                setOrderHistory(response.data);
            } catch (error) {
                console.error('Ошибка получения истории заказов:', error);
            }
        };
        fetchOrderHistory();
    }, [employeeId]);

    const handleOrderClick = (orderId) => {
        setSelectedOrderId(orderId);
    };

    const formatOrderDate = (orderDate) => {
        const date = new Date(orderDate);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('ru-RU', options);
        return formatter.format(date);
    };


    return (
        <View style={styles.fullContainer}>
            {selectedOrderId ? (
                <OrderDetails orderId={selectedOrderId} setSelectedOrderId={setSelectedOrderId} />
            ) : (
                <>
                    <Text style={styles.title}>История заказов</Text>
                    <ScrollView style={styles.container}>
                        {orderHistory.map((order) => (
                            <TouchableOpacity
                                key={order.order_id}
                                style={styles.orderContainer}
                                onPress={() => handleOrderClick(order.order_id)}
                            >
                                <Text style={styles.orderId}>Заказ #{order.order_id}</Text>
                                <Text style={styles.orderDate}>Дата: {formatOrderDate(order.order_date)}</Text>
                                <Text style={styles.orderTotal}>Сумма: {order.order_total} ₽</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const OrderDetails = ({ orderId, setSelectedOrderId }) => {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const response = await axios.get(`http://192.168.0.102:3000/order_items/${orderId}`);
                setOrderItems(response.data);
            } catch (error) {
                console.error('Ошибка получения состава заказа:', error);
            }
        };
        fetchOrderItems();
    }, [orderId]);

    const handleGoBack = () => {
        setSelectedOrderId(null);
    };

    return (
        <ScrollView>
        <View style={styles.orderDetailsContainer}>
            <Text style={styles.orderDetailsTitle}>Состав заказа #{orderId}</Text>
            {orderItems.map((item) => (
                <View key={item.dish_id} style={styles.productContainer}>
                    <View style={styles.productImageContainer}>
                        {item.imageSource && (
                            <Image
                                source={{ uri: item.imageSource }}
                                style={styles.productImage}
                            />
                        )}
                    </View>
                    <View style={styles.productDetails}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.dish_name}</Text>
                            <Text style={styles.productDescription}>
                                {item.item_price} ₽
                            </Text>
                        </View>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>Количество: {item.item_quantity}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
            <Button title="Назад" onPress={handleGoBack} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: '#f1e0c4',
        padding: 16,
        marginBottom: 70,
    },
    container: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 5,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    orderDate: {
        fontSize: 14,
        marginBottom: 4,
    },
    orderTotal: {
        fontSize: 14,
    },
    orderDetailsContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 5,
    },
    orderDetailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    productsContainer: {
        flex: 1,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    productDescription: {
        fontSize: 16,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginRight: 30,
        marginLeft: 30,
    },
});

export default History;