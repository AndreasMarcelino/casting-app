import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })

// Column mapping from Google Form → our schema
// Adjust SHEET_COLUMNS if you change the Google Form question order
const SHEET_COLUMNS = {
  timestamp:          0,
  nama:               1,
  ttl:                2,
  gender:             3,
  email:              4,
  telp:               5,
  alamat:             6,
  pendidikan:         7,
  tinggi:             8,
  berat:              9,
  rambut:             10,
  mata:               11,
  baju:               12,
  sepatu:             13,
  pengalaman_info:    14,
  pengalaman_akting:  15,
  pengalaman_vo:      16,
  bahasa:             17,
  keterampilan:       18,
  link_portofolio:    19,
  sosmed:             20,
  foto_link:          21,   // NEW field added to Google Form
  video_link:         22,   // NEW field added to Google Form
}

function parseRow(row) {
  const get = (col) => (row[col] ?? '').toString().trim()

  // Parse tanggal lahir dari TTL string (e.g. "Semarang, 12 Januari 1997")
  const ttl = get(SHEET_COLUMNS.ttl)
  const birthYear = ttl.match(/\d{4}/)?.[0]
  const age = birthYear ? new Date().getFullYear() - parseInt(birthYear) : null

  return {
    sheet_row_id:       get(SHEET_COLUMNS.timestamp), // used as dedup key
    timestamp:          get(SHEET_COLUMNS.timestamp),
    nama:               get(SHEET_COLUMNS.nama),
    ttl,
    age,
    gender:             get(SHEET_COLUMNS.gender),
    email:              get(SHEET_COLUMNS.email),
    telp:               get(SHEET_COLUMNS.telp),
    alamat:             get(SHEET_COLUMNS.alamat),
    pendidikan:         get(SHEET_COLUMNS.pendidikan),
    tinggi:             parseFloat(get(SHEET_COLUMNS.tinggi)) || null,
    berat:              parseFloat(get(SHEET_COLUMNS.berat)) || null,
    rambut:             get(SHEET_COLUMNS.rambut),
    mata:               get(SHEET_COLUMNS.mata),
    baju:               get(SHEET_COLUMNS.baju),
    sepatu:             get(SHEET_COLUMNS.sepatu),
    pengalaman_info:    get(SHEET_COLUMNS.pengalaman_info),
    pengalaman_akting:  get(SHEET_COLUMNS.pengalaman_akting),
    pengalaman_vo:      get(SHEET_COLUMNS.pengalaman_vo),
    bahasa:             get(SHEET_COLUMNS.bahasa),
    keterampilan:       get(SHEET_COLUMNS.keterampilan),
    link_portofolio:    get(SHEET_COLUMNS.link_portofolio),
    sosmed:             get(SHEET_COLUMNS.sosmed),
    foto_link:          get(SHEET_COLUMNS.foto_link),
    video_link:         get(SHEET_COLUMNS.video_link),
  }
}

export async function fetchSheetTalents() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID in .env')

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Form Responses 1!A2:Z',  // skip header row
  })

  const rows = response.data.values ?? []
  return rows.map(parseRow).filter(r => r.nama) // skip empty rows
}
