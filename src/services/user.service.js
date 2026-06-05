import { http } from "@/api/http.js";

export const getUsers = () => http.get("/users");