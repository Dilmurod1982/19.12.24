export function getFormData(form) {
  const data = new FormData(form);
  const obj = {};
  for (const [key, value] of data.entries()) {
    obj[key] = value;
  }

  return obj;
}

// export function getFormDataUser(form) {
//   const data = new FormData(form);
//   const obj = {};

//   // Собираем все стандартные поля
//   for (const [key, value] of data.entries()) {
//     obj[key] = value;
//   }

//   // Добавляем специальные поля, если они не попали в FormData
//   if (!obj.type && form.querySelector('[name="type"]')) {
//     obj.type = form.querySelector('[name="type"]').value;
//   }

//   // Логирование для отладки
//   console.log("Form data prepared:", obj);

//   return obj;
// }

export function getFormDataUser(form) {
  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());
  return obj;
}

export function collectItem(array, item) {
  const result = [];
  for (const obj of array) {
    result.push(obj[item]);
  }
  return Array.from(new Set(result));
}

export const BASE_URL = "https://json-api.uz/api/project/agnks";
export const allowPdfSizeLicense = 2_097_152;
export const allowPdfSizeDoc = 2_097_152;
