import { BASE_URL } from "../my-utils/index";

export async function refreshToken(token, navigate, setUser) {
  try {
    const res = await fetch(BASE_URL + "/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (res.status === 200 || res.status === 201) {
      return await res.json();
    }

    if (res.status === 400 || res.status === 401) {
      setUser(null);
      navigate("/login");
      throw new Error("Сеансга ажратилган вақт тугади. Тизимга қайта киринг!");
    }

    throw new Error("Нимадур хатолик кетди");
  } catch (error) {
    console.error("Токенни янгилашда хатолик:", error);
    setUser(null);
    navigate("/login");
    throw error;
  }
}

export async function login(data) {
  const res = await fetch(BASE_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return await res.json();
  if (res.status === 400 || res.status === 401)
    throw new Error("Логин ёки паролингизни хато киритдингиз");
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getUserInfo(token) {
  const res = await fetch(BASE_URL + "/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) return await res.json();
  if (res.status === 403) throw new Error("Доступ запрещен");
  throw new Error("Ошибка при получении информации о пользователе");
}

// export async function getUsers(token) {
//   try {
//     const [usersRes, usersaRes] = await Promise.all([
//       fetch(BASE_URL + "/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       fetch(BASE_URL + "/usersa", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ]);

//     if (usersRes.status === 403 || usersaRes.status === 403) {
//       throw new Error("403");
//     }

//     const users = await usersRes.json();
//     const usersa = await usersaRes.json();

//     return users.map((user) => ({
//       ...user,
//       ...usersa.find((ua) => ua.userId == user.id),
//     }));
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getUsers(token) {
//   try {
//     // Получаем данные из первой таблицы
//     const usersRes = await fetch(BASE_URL + "/users", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Получаем данные из второй таблицы
//     const usersaRes = await fetch(BASE_URL + "/usersa", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (usersRes.status === 403 || usersaRes.status === 403)
//       throw new Error(403);

//     const users = await usersRes.json();
//     const usersa = await usersaRes.json();

//     // Объединяем данные
//     const combinedData = users.data.map((user) => {
//       const userDetails =
//         usersa.data.find((detail) => detail.usersId === user.id) || {};
//       console.log(userDetails);
//       return {
//         id: user.id,
//         username: user.username,
//         type: user.type,
//         ...userDetails,
//       };
//     });

//     return { data: combinedData };
//   } catch (error) {
//     throw error;
//   }
// }

export async function getUsers(token) {
  try {
    const [usersRes] = await Promise.all([
      fetch(BASE_URL + "/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (usersRes.status === 403) throw new Error("403");

    const { data: users = [] } = await usersRes.json(); // Деструктурируем data

    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    throw error;
  }
  // 10.05.25
}

export async function getDailyReports(token) {
  try {
    const [usersRes] = await Promise.all([
      fetch(BASE_URL + "/dailyreports", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (usersRes.status === 403) throw new Error("403");

    const { data: users = [] } = await usersRes.json(); // Деструктурируем data

    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    throw error;
  }
}

export async function getPayment(token) {
  try {
    const [usersRes] = await Promise.all([
      fetch(BASE_URL + "/payment", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (usersRes.status === 403) throw new Error("403");

    const { data: users = [] } = await usersRes.json(); // Деструктурируем data

    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    throw error;
  }
}

// export async function getUsers(token) {
//   const res = await fetch(BASE_URL + "/users", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (res.status === 403) throw new Error(403);
//   if (res.status === 200 || res.status === 201) return await res.json();
//   else throw new Error("Нимадур хатолик бўлди");
// }

// export async function getUsers(token) {
//   try {
//     // Делаем параллельные запросы к users и usersa
//     const [usersRes, usersaRes] = await Promise.all([
//       fetch(BASE_URL + "/users", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }),
//       fetch(BASE_URL + "/usersa", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }),
//     ]);

//     // Проверяем ошибки авторизации
//     if (usersRes.status === 403 || usersaRes.status === 403) {
//       throw new Error("403");
//     }

//     // Получаем данные
//     const users = await usersRes.json();
//     const usersa = await usersaRes.json();

//     // Объединяем данные по ID пользователя
//     return users.map((user) => ({
//       ...user,
//       ...usersa.find((ua) => ua.userId == user.id), // предполагаем что в usersa есть поле userId
//     }));
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getUsers(token) {
//   const res = await fetch(BASE_URL + "/users", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (res.status === 403) throw new Error(403);
//   if (res.status === 200 || res.status === 201) return await res.json();
//   else throw new Error("Нимадур хатолик бўлди");
// }

export async function getLtd(token) {
  const res = await fetch(BASE_URL + "/ltd", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}
// export async function getPartners(token) {
//   const res = await fetch(BASE_URL + "/partners", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (res.status === 403) throw new Error(403);
//   if (res.status === 200 || res.status === 201) return await res.json();
//   else throw new Error("Нимадур хатолик бўлди");
// }

export async function getPartners(token) {
  try {
    const [usersRes] = await Promise.all([
      fetch(BASE_URL + "/partners", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (usersRes.status === 403) throw new Error("403");

    const { data: users = [] } = await usersRes.json(); // Деструктурируем data

    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    throw error;
  }
}

export async function getPartnerDailyReports(token) {
  try {
    const [usersRes] = await Promise.all([
      fetch(BASE_URL + "/partnersdailyreports", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (usersRes.status === 403) throw new Error("403");

    const { data: users = [] } = await usersRes.json(); // Деструктурируем data

    return users.map((user) => ({
      ...user,
    }));
  } catch (error) {
    throw error;
  }
}

export async function getKolonkamarka(token) {
  const res = await fetch(
    "https://json-api.uz/api/project/agnks/kolonkamarka",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавьте токен авторизации
      },
    }
  );

  if (res.status === 405) {
    throw new Error("Method Not Allowed");
  }
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`Ошибка: ${res.status}`);
  }
}
export async function getRegions(token) {
  const res = await fetch("https://json-api.uz/api/project/agnks/regions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Добавьте токен авторизации
    },
  });

  if (res.status === 405) {
    throw new Error("Method Not Allowed");
  }
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`Ошибка: ${res.status}`);
  }
}

export async function getCities(token) {
  const res = await fetch("https://json-api.uz/api/project/agnks/cities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 405) {
    throw new Error("Method Not Allowed");
  }
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(`Ошибка: ${res.status}`);
  }
}

export async function getStations(token) {
  const res = await fetch(BASE_URL + "/stations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getLicenses(token) {
  const res = await fetch(BASE_URL + "/licenses", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getNgsertificates(token) {
  const res = await fetch(BASE_URL + "/ngsertificates", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getHumidityes(token) {
  const res = await fetch(BASE_URL + "/humidityes", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getKolonka(token) {
  const res = await fetch(BASE_URL + "/kolonka", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function getDocs(token, base) {
  const res = await fetch(BASE_URL + `/${base}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

export async function registerUser(token, data) {
  const userRes = await fetch(BASE_URL + "/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!userRes.ok) throw new Error("Фойдаланувчи яратишда хатолик юз берди");

  return "Пользователь успешно создан";
  // 10.05.25
}

// export async function registerUser(token, data) {
//   const res = await fetch(BASE_URL + "/auth/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });
//   if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
//   if (res.status === 400 || res.status === 401)
//     throw new Error("Хатолик 400 401");
//   if (res.status === 403 || res.status === 402)
//     throw new Error("Хатолик 403 402");
//   else throw new Error("Нимадур хатолик бўлди");
//   console.log(res.status, res, await res.json());
// }

// export async function registerUser(token, data) {
//   const userData = {
//     username: data.username,
//     password: data.password,
//     surname: data.surname,
//     fname: data.fname,
//     lastname: data.lastname,
//     startDate: data.startDate,
//     endDate: data.endDate,
//     type: "user", // Добавляем тип пользователя по умолчанию
//   };

//   const res = await fetch(BASE_URL + "/auth/register", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(userData), // Отправляем полные данные
//   });

//   if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
//   if (res.status === 400 || res.status === 401)
//     throw new Error("Хатолик 400 401");
//   if (res.status === 403 || res.status === 402)
//     throw new Error("Хатолик 403 402");
//   throw new Error("Нимадур хатолик бўлди");
// }

export async function registerKolonkamarka(token, data) {
  const res = await fetch(BASE_URL + "/kolonkamarka", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}
export async function registerRegion(token, data) {
  const res = await fetch(BASE_URL + "/regions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerCity(token, data) {
  const res = await fetch(BASE_URL + "/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}
export async function registerltd(token, data) {
  const res = await fetch(BASE_URL + "/ltd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerPartner(token, data) {
  const res = await fetch(BASE_URL + "/partners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

// export async function registerPayment(token, data) {
//   const res = await fetch(BASE_URL + "/payment", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (res.ok) {
//     return await res.json();
//   }

//   const errorData = await res.json().catch(() => ({}));
//   throw new Error(errorData.message || "Произошла ошибка при создании платежа");
// }

export async function createPartnerDailyReport(token, data) {
  const res = await fetch(BASE_URL + "/partnersdailyreports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerDailyReport(token, data) {
  const res = await fetch(BASE_URL + "/dailyreports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerStation(token, data) {
  const res = await fetch(BASE_URL + "/stations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerLicense(token, data) {
  console.log(token, data);
  const res = await fetch(BASE_URL + "/licenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerNGSertificate(token, data) {
  console.log(token, data);
  const res = await fetch(BASE_URL + "/ngsertificates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerHumidity(token, data) {
  const res = await fetch(BASE_URL + "/humidityes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function registerDoc(token, data, base) {
  const res = await fetch(BASE_URL + `/${base}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot qoshildi";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function updateLicense(token, data) {
  console.log(token, data);
  const res = await fetch(BASE_URL + "/licenses", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 200 || res.status === 201) return "Malumot ўзгартирилди";
  if (res.status === 400 || res.status === 401)
    throw new Error("Хатолик 400 401");
  if (res.status === 403 || res.status === 402)
    throw new Error("Хатолик 403 402");
  else throw new Error("Нимадур хатолик бўлди");
  console.log(res.status, res, await res.json());
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(BASE_URL + "/upload", {
    method: "POST",
    body: formData,
  });

  if (res.status === 400)
    throw new Error("pdf файл хажми 0,5 Mb ортиқ бўлиши мумкин эмас!");
  if (res.status === 200 || res.status === 201) return res.text();
  else throw new Error("Нимадур хатолик бўлди");
}

// export async function fetchDataWithTokenRefresh(
//   fetchFunction,
//   setFunction,
//   user
// ) {
//   try {
//     const { data } = await fetchFunction(user?.access_token);
//     setFunction(data);
//   } catch (error) {
//     if (error.message === "403") {
//       try {
//         const { access_token } = await refreshToken(user?.refreshToken);
//         setUser({ ...user, access_token });
//         const { data } = await fetchFunction(access_token);
//         setFunction(data);
//       } catch (err) {
//         console.error("Ошибка при обновлении токена или загрузке данных:", err);
//       }
//     } else {
//       console.error("Ошибка при загрузке данных:", error);
//     }
//   }
// }

export async function fetchDataWithTokenRefresh(
  fetchFunction,
  setFunction,
  user,
  setUser,
  navigate,
  toast
) {
  try {
    const { data } = await fetchFunction(user?.access_token);
    setFunction(data);
  } catch (error) {
    if (error.message === "403") {
      try {
        // Попытка обновить токен
        const { access_token } = await refreshToken(user?.refreshToken);
        setUser({ ...user, access_token });

        // Повторная попытка получить данные
        const { data } = await fetchFunction(access_token);
        setFunction(data);
      } catch (err) {
        console.error("Ошибка при обновлении токена или загрузке данных:", err);

        toast.info("Тизимга қайта киринг!");
        setUser(null);
        navigate("/login");
      }
    } else {
      console.error("Ошибка при загрузке данных:", error);
    }
  }
}

// export async function accessToken() {
//   try {
//     const data = await fetchFunction(user?.access_token);
//     setFunction(data);
//   } catch (error) {
//     if (error.message === "403") {
//       try {
//         // Попытка обновить токен
//         const { access_token } = await refreshToken(user?.refreshToken);
//         setUser({ ...user, access_token });

//         // Повторная попытка получить данные
//         const newData = await fetchFunction(access_token);
//         setFunction(newData);
//       } catch (err) {
//         console.error("Ошибка при обновлении токена или загрузке данных:", err);
//         toast.info("Тизимга қайта киринг!");
//         setUser(null);
//         navigate("/login");
//       }
//     } else {
//       console.error("Ошибка при загрузке данных:", error);
//     }
//   }
// }

export async function updateStation(token, stationId, data) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Ошибка при обновлении станции");
  }

  return await res.json();
}

export async function getSingleUser(id, token) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 403) throw new Error("403");
  return await res.json();
}

export async function updateUser(id, updates, token) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (res.status === 403) throw new Error("403");
  return await res.json();
}

export async function assignStation(stationId, userId, token) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operatorId: userId }),
  });
  if (res.status === 403) throw new Error("403");
  return await res.json();
}

export async function unassignStation(stationId, userId, token) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}/unassign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operatorId: userId }),
  });
  if (res.status === 403) throw new Error("403");
  return await res.json();
}



export const registerPayment = async (token, paymentData) => {
  // console.log("1. paymentData:", paymentData);
  try {
    // 1. Сначала получаем все отчеты
    const reportsResponse = await fetch(`${BASE_URL}/partnersdailyreports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!reportsResponse.ok) {
      throw new Error(`Ошибка HTTP: ${reportsResponse.status}`);
    }
    const responseData = await reportsResponse.json();
    // console.log("2. responseData:", responseData);

    const allReports = responseData.data || [];
    // console.log("3. allReports:", allReports);

    if (!Array.isArray(allReports)) {
      throw new Error("Некорректный формат данных от сервера");
    }

    // 2. Находим нужный отчет по дате, станции и партнеру
    const targetReport = allReports.find(
      (report) =>
        report.date === paymentData.paymentDate &&
        report.station_id == paymentData.station_id &&
        report.partner_id == paymentData.partner_id
    );
    // console.log("4. targetReport:", targetReport);

    if (!targetReport) {
      throw new Error("Отчет не найден для указанной даты, станции и партнера");
    }

    // 3. Создаем новый платеж
    const newPayment = {
      paymentNumber: paymentData.paymentNumber,
      paymentSum: paymentData.paymentSum,
      approval: paymentData.approval || 0,
      user_id: paymentData.user_id,
      create_time: new Date().toISOString(),
    };

    // 4. Обновляем массив платежей и балансы текущего отчета
    const updatedPayments = [...(targetReport.payment || []), newPayment];
    const totalPayments = updatedPayments.reduce(
      (sum, payment) => sum + parseInt(payment.paymentSum || 0, 10),
      0
    );
    const updatedFinalBalance =
      parseInt(targetReport.initial_balace || 0, 10) +
      parseInt(targetReport.total_sum || 0, 10) -
      totalPayments;

    const updatedReport = {
      ...targetReport,
      payment: updatedPayments,
      final_balance: updatedFinalBalance.toString(),
    };

    // 5. Находим все последующие отчеты для этого партнера и станции
    const subsequentReports = allReports
      .filter(
        (report) =>
          report.station_id == paymentData.station_id &&
          report.partner_id == paymentData.partner_id &&
          new Date(report.date) > new Date(paymentData.paymentDate)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортируем по дате

    // console.log("5. subsequentReports:", subsequentReports);

    // 6. Создаем массив для обновления всех отчетов
    const reportsToUpdate = [updatedReport];
    let previousBalance = updatedFinalBalance;

    // 7. Пересчитываем балансы для последующих отчетов
    for (const report of subsequentReports) {
      const reportPayments = report.payment || [];
      const totalReportPayments = reportPayments.reduce(
        (sum, payment) => sum + parseInt(payment.paymentSum || 0, 10),
        0
      );

      const newInitialBalance = previousBalance;
      const newFinalBalance =
        newInitialBalance +
        parseInt(report.total_sum || 0, 10) -
        totalReportPayments;

      const updatedReport = {
        ...report,
        initial_balace: newInitialBalance.toString(),
        final_balance: newFinalBalance.toString(),
      };

      reportsToUpdate.push(updatedReport);
      previousBalance = newFinalBalance;
    }

    // console.log("6. reportsToUpdate:", reportsToUpdate);

    // 8. Отправляем все обновленные отчеты на сервер
    const updatePromises = reportsToUpdate.map((report) =>
      fetch(`${BASE_URL}/partnersdailyreports/${report.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(report),
      })
    );

    const updateResponses = await Promise.all(updatePromises);

    // Проверяем все ответы
    for (const response of updateResponses) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении отчетов");
      }
    }

    const results = await Promise.all(updateResponses.map((r) => r.json()));
    return results[0]; // Возвращаем результат первого обновления (основного платежа)
  } catch (error) {
    console.error("Error in registerPayment:", error);
    throw error;
  }
};

export const updatePartnerDailyReport = async (token, reportId, reportData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/partnersdailyreports/${reportId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении отчета:", error);
    throw error;
  }
};
