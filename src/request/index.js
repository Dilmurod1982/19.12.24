import { BASE_URL } from "../my-utils/index";

export async function refreshToken(token) {
  const res = await fetch(BASE_URL + "/auth/refresh-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (res.status === 200 || res.status === 201) return await res.json();
  if (res.status === 400 || res.status === 401) throw new Error("Хатолик");
  else throw new Error("Нимадур хатолик бўлди");
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
