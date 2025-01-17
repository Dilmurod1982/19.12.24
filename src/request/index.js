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

export async function getUsers(token) {
  const res = await fetch(BASE_URL + "/users", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 403) throw new Error(403);
  if (res.status === 200 || res.status === 201) return await res.json();
  else throw new Error("Нимадур хатолик бўлди");
}

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
  const res = await fetch(BASE_URL + "/auth/register", {
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
