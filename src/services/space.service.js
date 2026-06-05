import { http } from "@/api/http.js";

export const getSpaces = () => http.get("/spaces");

export const getSpaceById = (id) => http.get(`/spaces/${id}`);

export const createSpace = (data) => http.post("/spaces", data);

export const updateSpace = (id, data) => http.patch(`/spaces/${id}`, data);

export const deleteSpace = (id) => http.delete(`/spaces/${id}`);