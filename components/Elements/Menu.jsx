import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import _ from 'lodash';

const Menu = ({ employeeId }) => {
    const [tableNumber, setTableNumber] = useState('');
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false); // Добавлено новое состояние
    const [completeOrderVisible, setCompleteOrderVisible] = useState(true);
    const [tableOptions, setTableOptions] = useState([]);
    const [buttonText, setButtonText] = useState('Создать заказ');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [orderData, setOrderData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const CircularJSON = require('circular-json');

    useEffect(() => {
        const parsedTableNumber = parseInt(tableNumber);
        if (isNaN(parsedTableNumber)) {
            setButtonText('Создать заказ');
        } else {
            axios.get(`http://192.168.0.102:3000/orders/status/${tableNumber}`)
                .then((response) => {
                    const orderStatus = response.data.order_status;
                    if (orderStatus === 'Активен') {
                        setButtonText('Cостав заказа');
                        fetch('http://192.168.0.102:3000/dishes')
                            .then((response) => response.json())
                            .then((data) => {
                                const initialProducts = data.map((product) => ({
                                    ...product,
                                    counter: 0,
                                }));
                                setProducts(initialProducts);
                                const filtered = initialProducts.filter((product) =>
                                    product.dish_name.toLowerCase().includes(searchText.toLowerCase())
                                );
                                setFilteredProducts(filtered);
                            })
                            .catch((error) => {
                                console.error('Ошибка при получении данных:', error);
                            });

                    } else {
                        setProducts([]);
                        setButtonText('Создать заказ');
                    }
                })
                .catch((error) => {
                    setProducts([]);
                    setButtonText('Создать заказ');
                });
        }
    }, [tableNumber]);

    const handleOrderSummaryPress = () => {
        setShowOrderSummary(true);
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
        filterProducts(text);
    };

    const filterProducts = (text) => {
        const filtered = products.filter((product) =>
            product.dish_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const updateSelectedProducts = (updatedProducts) => {
        const parsedTableNumber = parseInt(tableNumber);
        const selectedProductsForTable = updatedProducts.filter((product) => product.counter > 0);
        setSelectedProducts((prevSelectedProducts) => ({
            ...prevSelectedProducts,
            [parsedTableNumber]: selectedProductsForTable,
        }));
    };

    const handleIncrement = (index) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            updatedProducts[index].counter += 1;
            updateSelectedProducts(updatedProducts);
            return updatedProducts;
        });
    };

    const handleDecrement = (index) => {
        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];
            if (updatedProducts[index].counter > 0) {
                updatedProducts[index].counter -= 1;
            }
            updateSelectedProducts(updatedProducts);
            return updatedProducts;
        });
    };

    const deepClone = (obj) => {
        if (obj === null || typeof obj !== "object") {
            return obj;
        }

        const clone = Array.isArray(obj) ? [] : {};

        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clone[key] = deepClone(obj[key]);
            }
        }

        return clone;
    };

    const insertItems = (order_id) => {
        const parsedNumber = parseInt(tableNumber);
        const orderDataForTable = selectedProducts[parsedNumber] || [];
        const orderDataForTableCopy = deepClone(orderDataForTable);
        const transformedProducts = orderDataForTableCopy.map((product) => {
            const { dish_id, dish_price, counter } = product;
            return {
                dish_id,
                item_quantity: counter,
                item_price: dish_price,
            };
        });
        const getOrderId = () => {
            const parsedTableNumber = parseInt(tableNumber);
            if (isNaN(parsedTableNumber)) {
                alert("Введите корректный номер стола!");
            } else {
                axios
                    .get(`http://192.168.0.102:3000/get_order_id?parsedTableNumber=${parsedTableNumber}`)
                    .then((response) => {
                        const order_id = response.data.order_id;
                        console.log('order_id:', order_id);
                    })
                    .catch((error) => {
                        console.error('Ошибка при получении order_id:', error);
                    });
            }
        };
        const orderID = getOrderId();

        const hasCircularReference = (obj) => {
            const cache = new Set();
            const hasCircularRef = (obj) => {
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === "object" && value !== null) {
                        if (cache.has(value)) {
                            return true;
                        }
                        cache.add(value);
                        if (hasCircularRef(value)) {
                            return true;
                        }
                        cache.delete(value);
                    }
                }
                return false;
            };

            return hasCircularRef(obj);
        };

        if (hasCircularReference(transformedProducts)) {
            console.error("Обнаружены циклические ссылки в orderDataForTable");
            return;
        }
        getOrderId();
        const parsedTableNumber = parseInt(tableNumber);
        axios
            .post("http://192.168.0.102:3000/orders/create", {
                transformedProducts,
                parsedTableNumber,
                orderID,
            })
            .then((response) => {
                console.log("Заказ успешно создан:", response.data.message);
                setButtonText("Создать заказ");
                setShowOrderSummary(false);
                setCompleteOrderVisible(true);
                setTableNumber("Выбрать стол");
                setProducts([]);
            })
            .catch((error) => {
                console.error("Ошибка при создании заказа:", error);
            });
    };


    useEffect(() => {
        fetch(`http://192.168.0.102:3000/tables/my_tables?employee_id=${employeeId}`)
            .then((response) => response.json())
            .then((data) => {
                const formattedTableOptions = data.map((tableId) => ({
                    id: tableId,
                    name: `Стол № ${tableId}`,
                }));
                setTableOptions(formattedTableOptions);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных:', error);
            });
    }, []);

    const handleTableSelect = (option) => {
        setTableNumber(option.id);
        setShowDropdown(false);
        const orderDataForTable = orderData[option.id] || [];
        setSelectedProducts(orderDataForTable);
    };

    const renderTableOptions = () => {
        return tableOptions.map((option, index) => (
            <TouchableOpacity
                key={index}
                style={styles.tableOption}
                onPress={() => handleTableSelect(option)}
            >
                <Text style={styles.tableOptionText}>{option.name}</Text>
            </TouchableOpacity>
        ));
    };

    const renderProduct = (product, index) => {
        return (
            <View key={index} style={styles.productContainer}>
                <View style={styles.productImageContainer}>
                    {product.imageSource && (
                        <Image source={{ uri: product.imageSource }} style={styles.productImage} />
                    )}
                </View>
                <View style={styles.productDetails}>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.dish_name}</Text>
                        <Text style={styles.productDescription}>{product.dish_price} ₽</Text>
                    </View>
                    <View style={styles.counterContainer}>
                        <TouchableOpacity onPress={() => handleDecrement(index)} style={[styles.counterButton, { backgroundColor: 'red' }]}>
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{product.counter}</Text>
                        <TouchableOpacity onPress={() => handleIncrement(index)} style={[styles.counterButton, { backgroundColor: 'green' }]}>
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderOrderSummary = () => {
        const parsedTableNumber = parseInt(tableNumber);
        const orderDataForTable = selectedProducts[parsedTableNumber] || [];
        return (
            <View style={styles.fullContainer}>
                <ScrollView style={styles.container}>
                    <Text style={styles.orderSummaryTitle}>Состав заказа:</Text>
                    {orderDataForTable.map((product, index) => {
                        if (product.counter > 0) {
                            return (
                                <View key={index} style={styles.productContainer}>
                                    <View style={styles.productImageContainer}>
                                        {product.imageSource && (
                                            <Image
                                                source={{ uri: product.imageSource }}
                                                style={styles.productImage}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.productDetails}>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{product.dish_name}</Text>
                                            <Text style={styles.productDescription}>
                                                {product.dish_price} ₽
                                            </Text>
                                        </View>
                                        <View style={styles.counterContainer}>
                                            <TouchableOpacity
                                                onPress={() => handleDecrement(index)}
                                                style={[
                                                    styles.counterButton,
                                                    { backgroundColor: 'red' },
                                                ]}
                                            >
                                                <Text style={styles.counterButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.counterText}>{product.counter}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleIncrement(index)}
                                                style={[
                                                    styles.counterButton,
                                                    { backgroundColor: 'green' },
                                                ]}
                                            >
                                                <Text style={styles.counterButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ScrollView>
                <View style={styles.buttonEditContainer}>
                    <TouchableOpacity style={styles.editOrderButton} onPress={() => handleEditPress()}>
                        <Text style={styles.editOrderButtonText}>Изменить заказ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.generateReceiptButton} onPress={insertItems}>
                        <Text style={styles.generateReceiptButtonText}>Сформировать чек</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const createOrder = () => {
        const parsedTableNumber = parseInt(tableNumber);
        if (isNaN(parsedTableNumber)) {
            alert("Введите корректный номер стола!");
        } else {
            const order = {
                table_id: parsedTableNumber,
                order_date: new Date().toISOString(),
                order_status: 'Активен',
                employee_id: employeeId,
            };

            if (order.table_id === null) {
                alert("Выберите стол!");
            } else {
                axios.post('http://192.168.0.102:3000/orders', order)
                    .then((response) => {
                        console.log('Заказ успешно создан:', response.data);
                    })
                    .catch((error) => {
                        console.error('Ошибка при создании заказа:', error);
                    });
            }
        }
    };

    const handleButtonPress = () => {
        const parsedTableNumber = parseInt(tableNumber);
        if (isNaN(parsedTableNumber)) {
            alert('Выберите стол!');
        } else {
            if (buttonText === 'Cостав заказа') {
                setShowOrderSummary(true);
                setCompleteOrderVisible(false);
                renderOrderSummary(selectedProducts);
            } else if (buttonText === 'Создать заказ') {
                setShowOrderSummary(false);
                setCompleteOrderVisible(false);
                createOrder();
            }
        }
    };

    const handleEditPress = () => {
        setShowOrderSummary(false);
        setCompleteOrderVisible(true);
        setEditMode(true);
        setButtonText('Состав заказа');
    };


    return (
        <View style={styles.fullContainer}>
            {showOrderSummary ? (
                renderOrderSummary()
            ) : (
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.tableNumberContainer}>
                        <TouchableOpacity
                            style={styles.tableButton}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Text style={styles.tableButtonText}>{tableNumber ? tableNumber : 'Выбрать стол'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            value={searchText}
                            onChangeText={handleSearchTextChange}
                            style={styles.searchInput}
                            placeholder="Поиск"
                        />
                    </View>
                </View>
                {showDropdown && (
                    <View style={styles.dropdownContainer}>
                        <View style={styles.tableOptions}>{renderTableOptions()}</View>
                    </View>
                )}
                    <ScrollView style={styles.productsContainer}>
                        {filteredProducts.map((product, index) => renderProduct(product, index))}
                    </ScrollView>
            </View>
                )}
            {completeOrderVisible && (
            <TouchableOpacity style={styles.buttonContainer} onPress={handleButtonPress}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f1e0c4',
        padding: 16,
        marginBottom: 80,
        paddingTop: 10,
    },
    productsContainer: {
        flex: 1,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 17,
        left: 16,
        right: 0,
        bottom: 0,
        zIndex: 1,
        width: 159,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tableNumberContainer: {
        flex: 1,
        marginRight: 10,
    },
    tableButton: {
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#c22d2d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableButtonText: {
        color: '#d9a98b',
        fontSize: 16,
    },
    tableOptions: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 0,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    tableOption: {
        paddingVertical: 8,
    },
    tableOptionText: {
        fontSize: 16,
    },
    searchContainer: {
        flex: 1,
        height: 41,
    },
    searchInput: {
        borderWidth: 1,
        padding: 10,
        fontSize: 14,
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
    counterButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    counterText: {
        paddingHorizontal: 5,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 16,
        backgroundColor: '#c22d2d',
        padding: 10,
        borderRadius: 5,
        width: 130,
    },
    buttonEditContainer: {
        flexDirection: "row",
        borderRadius: 5,
        justifyContent: "space-between",
        bottom: 50
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    orderSummaryContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 16,
    },
    orderSummaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    editOrderButton: {
        backgroundColor: '#c22d2d',
        padding: 10,
        borderRadius: 5,
        width: 140,
        marginTop: 40
    },
    editOrderButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    generateReceiptButton: {
        backgroundColor: '#c22d2d',
        padding: 10,
        borderRadius: 5,
        marginTop: 40,
        height: 41
    },
    generateReceiptButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Menu;