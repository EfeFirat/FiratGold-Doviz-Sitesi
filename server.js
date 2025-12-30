const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors()); // Sitenin sunucuya erişmesine izin ver
app.use(express.json());

// --- AYARLAR ---
const PORT = 3000;
const API_KEY = "AIzaSyDmjNFErGYetYKCMrkT5AGpY6zQl-q00p4"; 

// --- DÜZELTİLEN KISIM BURASI ---
// Aşağıdaki satır eksikti, bu yüzden hata veriyordu:
const genAI = new GoogleGenerativeAI(API_KEY);
// ------------------------------

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `Sen FıratGold kuyumcusunun çok bilgili, güler yüzlü ve samimi sanal asistanısın. İstanbul Kapalıçarşı fıratgold şubesi için çalışıyorsun.

  GÖREVLERİN VE KURALLARIN:
  1. Müşteriyle samimi bir esnaf gibi konuş ("Hoş geldiniz", "Tabii yardımcı olayım" gibi ifadeler kullan).
  2. Altın çeşitleri, ayar farkları (22 ayar vs 24 ayar), düğün takıları tavsiyesi ver ama yatırım tavsiyesi verme Türkiyede yasak. "Bilmiyorum" deme, genel kültürünü kullan.
  3. Biri "Fiyat ne kadar?" derse: "Piyasalar saniyelik değişiyor efendim ama sitemizdeki hesaplama aracını kullanabilir veya net fiyat için bizi arayabilirsiniz. Genel olarak piyasa şu an hareketli..." gibi yönlendirici konuş. Asla sadece "Dükkana gelin" deyip kestirip atma.
  4. "Çeyrek altın nedir?", "Has altın nedir?" gibi soruları kısaca ama çok açıklayıcı şekilde açıkla.
  5. Konu altın, döviz, gümüş veya takı ise her şeyi cevapla.
  6. Sadece konu futbol, yemek veya siyaset ise "Ben sadece altın işinden anlarım efendim" diyerek kibarca reddet.
  7. Biz kuyumcu değiliz Döviz bürosuyuz o yüzden dükkanımızdan yüzük küpe alınmıyor.
  8. binance altın değerini kullanarak anlık gram fiyatını çeyrek fiyatını falan sorulduğu zaman söyle.
  9. Binance verileri kullandığını söyleme.
  
  Adresimiz: İstanbul Kapalıçarşı Fıratgold. Telefonla sipariş alıyoruz.`
});

// --- SİTENİN BAĞLANACAĞI ADRES ---
app.post('/chat', async (req, res) => {
  try {
    const { soru, fiyat } = req.body; // Hem soruyu hem fiyatı alıyoruz
    console.log("Soru:", soru, "Gelen Fiyat:", fiyat);

    // Yapay zekaya gizli bir bağlam (context) oluşturuyoruz
    const guncelSoru = `(ŞU ANKİ CANLI GRAM ALTIN SATIŞ FİYATI: ${fiyat} TL. Bu bilgiyi kullanarak cevap ver.) Kullanıcının sorusu: ${soru}`;

    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(guncelSoru);
    const cevap = await result.response.text();

    res.json({ cevap: cevap });
    
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ cevap: "Şu an cevap veremiyorum." });
  }
});

// --- SUNUCUYU BAŞLAT ---
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor! Adres: http://localhost:${PORT}`);
});