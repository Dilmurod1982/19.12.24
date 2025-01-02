// utils/documentStatus.js

export function getDocumentStatus(expiration) {
    // Функция для преобразования формата даты DD.MM.YYYY в YYYY-MM-DD
    const formatDate = (date) => {
      const [day, month, year] = date.split(".");
      return `${year}-${month}-${day}`;
    };
  
    // Проверка валидности даты
    const isValidDate = (date) => {
      const parsedDate = new Date(formatDate(date));
      return !isNaN(parsedDate.getTime());
    };
  
    // Функция для расчета оставшихся или прошедших дней
    const calculateDaysDifference = (expirationDate) => {
      if (!isValidDate(expirationDate)) return null; // Возвращаем null для невалидных дат
      const now = new Date();
      const expDate = new Date(formatDate(expirationDate));
      return Math.ceil((expDate - now) / (1000 * 60 * 60 * 24)); // Разница в днях
    };
  
    const daysLeft = calculateDaysDifference(expiration);
  
    if (daysLeft === null) {
      return { text: "Сана нотўғри", bgColorClass: "bg-gray-200" }; // Серый фон для невалидных дат
    } else if (daysLeft > 30) {
      return { text: `${daysLeft} кун қолди`, bgColorClass: "bg-white" }; // Нормальный фон
    } else if (daysLeft <= 30 && daysLeft > 15) {
      return { text: `${daysLeft} кун қолди`, bgColorClass: "bg-green-200" }; // Зеленый фон
    } else if (daysLeft <= 15 && daysLeft > 5) {
      return { text: `${daysLeft} кун қолди`, bgColorClass: "bg-yellow-200" }; // Желтый фон
    } else if (daysLeft <= 5 && daysLeft > 0) {
      return { text: `${daysLeft} кун қолди`, bgColorClass: "bg-orange-200" }; // Оранжевый фон
    } else {
      return { text: `${Math.abs(daysLeft)} кун ўтиб кетди`, bgColorClass: "bg-red-200" }; // Красный фон
    }
  }
  