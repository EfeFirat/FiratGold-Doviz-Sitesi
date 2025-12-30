const { GoogleGenerativeAI } = require("@google/generative-ai");

// API Anahtarını buraya yapıştır
const genAI = new GoogleGenerativeAI("AIzaSyBERvFvGoM_EA9cqmbWWhbJKdIHh9E6AeQ");

// Senin listende en üstte çıkan hızlı modeli seçiyoruz
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  // Bu model "systemInstruction" komutunu çok iyi anlar
  systemInstruction: "Sen FıratGold kuyumcusunun sanal asistanısın. İstanbul Kapalıçarşı FıratGold şubesi için çalışıyorsun. Sadece altın fiyatları, bilezik modelleri, döviz (dolar/euro) ve yatırım tavsiyesi olmayan piyasa yorumları yaparsın. Eğer biri sana 'FıratGold nerede?' derse 'İstanbul KapalıÇarşıda hizmet vermekteyiz efendim' dersin. Altın ve döviz dışındaki sorulara (örneğin ödev, yemek tarifi, futbol) kibarca cevap vermeyi reddedersin."
});

async function yapayZekayaSor(soru) {
  try {
    console.log("Yapay zeka düşünüyor...");
    
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(soru);
    const cevap = await result.response.text();
    
    console.log("------------------------------------------------");
    console.log("SORU:", soru);
    console.log("CEVAP:", cevap);
    console.log("------------------------------------------------");
    
  } catch (error) {
    console.error("HATA OLUŞTU:", error);
  }
}

// Test Sorusu
yapayZekayaSor("Dükkanınız nerede ve çeyrek altın var mı?");