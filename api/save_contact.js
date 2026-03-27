// ============================================================
//  NEXUS TECH — API Route para Vercel (Serverless Function)
//  Archivo: /api/save_contact.js
//  Variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
// ============================================================

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // ── Leer body ──────────────────────────────────────────────
  const { nombres, apellidos, correo, telefono, mensaje } = req.body ?? {};

  // ── Validar ────────────────────────────────────────────────
  const errors = [];
  if (!nombres?.trim())                          errors.push('Nombres requerido');
  if (!apellidos?.trim())                        errors.push('Apellidos requerido');
  if (!correo?.includes('@'))                    errors.push('Correo inválido');
  if (!/^[\d\s\+\-\(\)]{7,20}$/.test(telefono)) errors.push('Teléfono inválido');
  if (!mensaje?.trim())                          errors.push('Mensaje requerido');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: 'validation', details: errors });
  }

  // ── Normalizar ─────────────────────────────────────────────
  const data = {
    nombres:   nombres.trim().toUpperCase(),
    apellidos: apellidos.trim().toUpperCase(),
    correo:    correo.trim(),
    telefono:  telefono.trim(),
    mensaje:   mensaje.trim(),
  };

  // ── Leer variables de entorno ──────────────────────────────
  const db_host = process.env.DB_HOST || '';
  const db_port = process.env.DB_PORT || '5432';
  const db_name = process.env.DB_NAME || '';
  const db_user = process.env.DB_USER || '';
  const db_pass = process.env.DB_PASS || '';

  if (!db_host || !db_user || !db_pass || !db_name) {
    return res.status(500).json({
      success: false,
      error:   'db_config',
      detail:  'Faltan variables de entorno. Verifica DB_HOST, DB_PORT, DB_NAME, DB_USER y DB_PASS en Vercel.',
    });
  }

  // ── Construir connection string para Neon ──────────────────
  const connectionString = `postgresql://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}?sslmode=require`;

  const sql = neon(connectionString);

  // ── Crear tabla si no existe ───────────────────────────────
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS Clientes_web (
        Id        SERIAL        PRIMARY KEY,
        Nombres   VARCHAR(150)  NOT NULL,
        Apellidos VARCHAR(150)  NOT NULL,
        Correo    VARCHAR(254)  NOT NULL,
        Telefono  VARCHAR(20)   NOT NULL UNIQUE,
        Mensaje   VARCHAR(2000)
      )
    `;
  } catch (err) {
    console.error('[NEXUS] Create table:', err.message);
  }

  // ── Verificar duplicado por teléfono ───────────────────────
  try {
    const existing = await sql`
      SELECT Id FROM Clientes_web WHERE Telefono = ${data.telefono} LIMIT 1
    `;
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error:   'duplicate',
        detail:  'Este número de teléfono ya está registrado.',
      });
    }
  } catch (err) {
    console.error('[NEXUS] Duplicate check:', err.message);
    return res.status(500).json({ success: false, error: 'db_error', detail: err.message });
  }

  // ── Insertar registro ──────────────────────────────────────
  try {
    const result = await sql`
      INSERT INTO Clientes_web (Nombres, Apellidos, Correo, Telefono, Mensaje)
      VALUES (${data.nombres}, ${data.apellidos}, ${data.correo}, ${data.telefono}, ${data.mensaje})
      RETURNING Id
    `;
    return res.status(200).json({
      success: true,
      id:      result[0]?.id ?? null,
      message: 'Registro guardado exitosamente',
    });
  } catch (err) {
    console.error('[NEXUS] Insert:', err.message);
    if (err.message.includes('23505') || err.message.includes('unique')) {
      return res.status(409).json({
        success: false,
        error:   'duplicate',
        detail:  'Este número de teléfono ya está registrado.',
      });
    }
    return res.status(500).json({ success: false, error: 'db_insert', detail: err.message });
  }
}
