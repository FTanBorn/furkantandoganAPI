// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Register
app.post("/auth/register", async (req, res) => {
  const { email, username, full_name, password } = req.body;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const { error: userError } = await supabase.from("users").insert({
      id: user.id,
      email,
      username,
      full_name,
      is_active: true,
    });

    if (userError) throw userError;

    res.status(201).json({
      success: true,
      message: "Kayıt başarılı",
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Logout
app.post("/auth/logout", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Token gerekli",
    });
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.json({
      success: true,
      message: "Çıkış başarılı",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reset Password
app.post("/auth/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) throw error;

    res.json({
      success: true,
      message: "Şifre sıfırlama maili gönderildi",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});
