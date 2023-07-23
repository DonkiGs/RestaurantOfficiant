import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TopBar from "../UI/TopBar";
import { useRoute } from '@react-navigation/native';
import styles from "../Styles/Main_Styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Menu from "../Elements/Menu";
import History from "../Elements/History";
import axios from "axios";

const Main = ({route}) => {
    const [showSquares, setShowSquares] = useShowSquares();
    const { FIO, employee_id } = route.params;
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigation = useNavigation();
    const [showMenu, setShowMenu] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    let SelectedSquare = 0;
    const [employeeId, setEmployeeId] = useState('');
    const [tableProducts, setTableProducts] = useState({});

    const handleLogout = () => {
        navigation.navigate('Auth');
    };

    const handleCloseModal = () => {
        setShowInfoModal(false);
    };

    const handleStolPress = () => {
        setShowSquares(!showSquares);
        setShowMenu(false);
        setShowHistory(false);
    };

    const handleProfileIconPress = () => {
        setShowInfoModal(!showInfoModal);
    };

    const handleSelectDate = () => {
        setShowDatePicker(!showDatePicker);
    };

    const handleConfirmDate = (event, date) => {
        if (date !== undefined) {
            setSelectedDate(date);
        }
        setShowDatePicker(false);
    };

    const handleCancelDate = () => {
        setShowDatePicker(false);
    };

    const handleSquarePress = (value) => {
        SelectedSquare = value;
    };

    const handleMenuPress = () =>
    {
        setShowSquares(false);
        setShowMenu(!showMenu);
        setShowHistory(false);
        setEmployeeId(employee_id);
    }

    const handleHistoryPress = () =>
    {
        setShowSquares(false);
        setShowHistory(!showHistory);
        setShowMenu(false);
        setEmployeeId(employee_id)
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <Modal
                visible={showInfoModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Icon name="close" size={24} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Общая информация</Text>
                        <Text style={styles.modalText}>Кол-во столиков: </Text>
                        <Text style={styles.modalText}>Текущая смена: </Text>
                        <View style={styles.datePickerContainer}>
                            <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.buttonDate}>
                                <Text style={styles.buttonText}>Сегодня</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSelectDate} style={styles.buttonDate}>
                                <Text style={styles.buttonText}>Выбрать дату</Text>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate || new Date()}
                                mode="date"
                                display="default"
                                maximumDate={new Date()}
                                onChange={handleConfirmDate}
                            />
                        )}
                    </View>
                    <TouchableOpacity  style={styles.buttonModal} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Выйти из аккаунта</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <View style={styles.header}>
                <View style={styles.profileIconContainer}>
                    <TouchableOpacity onPress={handleProfileIconPress}>
                        <Icon name="account-circle" size={56} color="#d9a98b" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{FIO}</Text>
            </View>
            <View style={styles.middleContainer}>
                {showSquares && <Squares onPress={handleSquarePress} employee_id={employee_id}/>}
                {showMenu && <Menu employeeId={employee_id}/>}
                {showHistory && <History employeeId={employee_id}/>}
            </View>
            <TopBar showMenu={showMenu} setShowMenu={setShowMenu} showHistory={showHistory} setShowHistory={setShowHistory} onStolPress={handleStolPress} onMenuPress={handleMenuPress} onHistoryPress={handleHistoryPress}/>
        </SafeAreaView>
    );
};


const useShowSquares = (showMenu, setShowMenu, showHistory, setShowHistory) => {
    const [showSquares, setShowSquares] = useState(false);
    return [showSquares, setShowSquares];
};

const Squares = ({ onPress, employee_id }) => {
    const handlePress = (value) => {
        onPress(value);
    };

    return (
        <View style={styles.squareContainer}>
            <View style={styles.row}>
                <Square value={1} onPress={handlePress} employee_id={employee_id}/>
                <Square value={2} onPress={handlePress} employee_id={employee_id}/>
                <Square value={3} onPress={handlePress} employee_id={employee_id}/>
            </View>
            <View style={styles.row}>
                <Square value={4} onPress={handlePress} employee_id={employee_id}/>
                <Square value={5} onPress={handlePress} employee_id={employee_id}/>
            </View>
            <View style={styles.row}>
                <Square value={6} onPress={handlePress} employee_id={employee_id}/>
                <Square value={7} onPress={handlePress} employee_id={employee_id}/>
                <Square value={8} onPress={handlePress} employee_id={employee_id}/>
            </View>
        </View>
    );
};


const Square = ({ value, onPress, employee_id }) => {
    const [isUpdated, setIsUpdated] = useState(false);
    const [isOccupied, setIsOccupied] = useState(false);
    const [tableColor, setTableColor] = useState('');

    useEffect(() => {
        checkOccupiedStatus();
    }, []);

    const handlePress = () => {
        onPress(value);
        updateTable(employee_id, value);
    };

    const getTableData = (value) => {
        console.log(value);
        return axios.get(`http://192.168.0.102:3000/tables/select/${value}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Ошибка при получении данных таблицы:', error);
                throw error;
            });
    };

    const updateTable = (employee_id, value) => {
        return getTableData(value)
            .then(tableData => {
                const currentEmployeeId = tableData.table_employee_id;

                if (currentEmployeeId === null) {
                    axios.put(`http://192.168.0.102:3000/tables/update/${value}`, { employee_id })
                        .then(response => {
                            console.log('Таблица успешно обновлена');
                            setIsUpdated(true);
                            alert("Вы начали обслуживать стол");
                            checkOccupiedStatus();
                        });
                } else if (currentEmployeeId === employee_id) {
                    axios.delete(`http://192.168.0.102:3000/tables/update_occupied/${value}`)
                        .then(response => {
                            console.log('Пользователь снят со стола');
                            setIsUpdated(true);
                            alert("Вы закончили обслуживать стол");
                            checkOccupiedStatus();
                        });
                } else if (currentEmployeeId !== employee_id) {
                    alert("Стол занят!");
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении таблицы:', error);
                alert("Ошибка при обновлении таблицы");
            });
    };


    const checkOccupiedStatus = async () => {
        try {
            const response = await axios.get(`http://192.168.0.102:3000/tables/occupied?employee_id=${employee_id}`);
            const occupiedTables = response.data;

            const isTableOccupied = occupiedTables.some(table => table.table_id === value && table.isOccupied);

            setIsOccupied(isTableOccupied);

            if (isTableOccupied) {
                const table = occupiedTables.find(table => table.table_id === value);
                if (table.table_employee_id === employee_id) {
                    setTableColor('#c22d2d');
                } else {
                    setTableColor('#800080');
                }
            } else {
                setTableColor('#008000');
            }
        } catch (error) {
            console.error('Ошибка при получении информации о таблицах:', error);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.square,
                isUpdated && styles.updatedSquare,
                tableColor ? { backgroundColor: tableColor } : null
            ]}
            onPress={handlePress}
        >
            <Text style={styles.SquareText}>№{value}</Text>
        </TouchableOpacity>
    );
};

export default Main;