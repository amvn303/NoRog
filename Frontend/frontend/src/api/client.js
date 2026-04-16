import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

export const bootstrapUser = async (externalId, name) => {
  const res = await api.post("/users/bootstrap", { externalId, name });
  return res.data;
};

export const getProfiles = async (userId) => {
  const res = await api.get(`/profiles?userId=${encodeURIComponent(userId)}`);
  return res.data;
};

export const createProfile = async (payload) => {
  const res = await api.post("/profiles", payload);
  return res.data;
};

export const postChatMessage = async ({ userId, profileId, text }) => {
  const res = await api.post("/chat", { userId, profileId, text });
  return res.data;
};

export const getChatSession = async ({ userId, profileId }) => {
  const res = await api.get(
    `/chat?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(profileId)}`
  );
  return res.data;
};

export const postPredict = async ({ userId, profileId, symptoms, behaviors = {}, goal = "general wellness" }) => {
  const res = await api.post("/predict", { userId, profileId, symptoms, behaviors, goal });
  return res.data;
};

export const postSimulate = async ({ userId, profileId, condition, behaviors = {}, toggles = {} }) => {
  const res = await api.post("/simulate", { userId, profileId, condition, behaviors, toggles });
  return res.data;
};

export const getHistory = async ({ userId, profileId, limit = 10 }) => {
  const res = await api.get(
    `/history?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(
      profileId
    )}&limit=${limit}`
  );
  return res.data;
};

export const getDrift = async ({ userId, profileId }) => {
  const res = await api.get(
    `/drift?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(profileId)}`
  );
  return res.data;
};

export const getProfile = async ({ userId, profileId }) => {
  const res = await api.get(
    `/profile?userId=${encodeURIComponent(userId)}&profileId=${encodeURIComponent(profileId)}`
  );
  return res.data;
};

export default api;

