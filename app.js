// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBft8FA2rTVZG3AkSu63Bk86FCPNvKC_hA",
    authDomain: "latihan2-f2b0f.firebaseapp.com",
    databaseURL: "https://latihan2-f2b0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "latihan2-f2b0f",
    storageBucket: "latihan2-f2b0f.firebasestorage.app",
    messagingSenderId: "33212839471",
    appId: "1:33212839471:web:8f6f5d79785dfdfd2438da"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 2. ELEMEN GLOBAL
// 2. AMBIL ELEMEN HTML
const elements = {
    suhu: document.getElementById('suhu'),
    phAir: document.getElementById('ph-air'),
    kelembapan: document.getElementById('kelembapan'),
    panelWatt: document.getElementById('panel-watt'),
    panelVolt: document.getElementById('panel-volt'),
    panelAmpere: document.getElementById('panel-ampere'),
    bateraiPersen: document.getElementById('baterai-persen'),
    bateraiVolt: document.getElementById('baterai-volt'),
    time: document.getElementById('current-time'),
    statusPompa: document.getElementById('status-pompa'),
    cardPompa: document.getElementById('card-pompa'),
    // Penambahan untuk navigasi
    btnDashboard: document.getElementById('btn-dashboard'),
    btnRiwayat: document.getElementById('btn-riwayat'),
    btnGrafik: document.getElementById('btn-grafik'),
    kontenDashboard: document.getElementById('konten-dashboard'),
    kontenRiwayat: document.getElementById('konten-riwayat'),
    kontenGrafik: document.getElementById('konten-grafik'),
    tabelRiwayat: document.getElementById('isi-tabel-riwayat')
    
}; // <--- Pastikan ada titik koma di sini

// Tambahkan ini tepat di bawah kurung tutup elements di atas
let chartSuhu, chartPh, chartKelembapan, chartVolt;

// 3. LOGIKA NAVIGASI
function gantiHalaman(halamanAktif, tombolAktif) {
    // Sembunyikan semua
    elements.kontenDashboard.style.display = 'none';
    elements.kontenRiwayat.style.display = 'none';
    elements.kontenGrafik.style.display = 'none';
    
    // Matikan semua warna tombol
    elements.btnDashboard.classList.remove('active');
    elements.btnRiwayat.classList.remove('active');
    elements.btnGrafik.classList.remove('active');
    
    // Tampilkan yang dipilih
    halamanAktif.style.display = 'block';
    tombolAktif.classList.add('active');
}

function setupNavigation() {
    elements.btnDashboard.onclick = () => gantiHalaman(elements.kontenDashboard, elements.btnDashboard);
    elements.btnRiwayat.onclick = () => {
        gantiHalaman(elements.kontenRiwayat, elements.btnRiwayat);
        muatRiwayat();
    };
    elements.btnGrafik.onclick = () => {
        gantiHalaman(elements.kontenGrafik, elements.btnGrafik);
        muatGrafik();
    };
}

// 4. FUNGSI DATA (REAL-TIME & RIWAYAT)
function listenToData() {
    database.ref('monitoring').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            elements.suhu.innerText = data.suhu;
            elements.phAir.innerText = data.phAir;
            elements.kelembapan.innerText = data.kelembapan;
            elements.panelWatt.innerText = data.panelWatt + " W";
            elements.panelVolt.innerText = data.panelVolt + " V";
            elements.panelAmpere.innerText = data.panelAmpere + " A";
            elements.bateraiPersen.innerText = data.bateraiPersen + " %";
            elements.bateraiVolt.innerText = data.bateraiVolt + " V (Input)";
            if (data) {
            // ... (kode suhu, ph, dll yang sudah ada) ...
            
            // Logika Status Pompa
            if (data.pompa === "ON" || data.pompa === 1 || data.pompa === true) {
                elements.statusPompa.innerText = "NYALA";
                elements.cardPompa.style.backgroundColor = "#2ecc71"; // Hijau saat nyala
                elements.statusPompa.style.color = "white";
            } else {
                elements.statusPompa.innerText = "MATI";
                elements.cardPompa.style.backgroundColor = "white"; // Kembali putih saat mati
                elements.statusPompa.style.color = "#2c3e50";
            }
        }
        }
    });
}

function muatRiwayat() {
    const tgl = new Date().toISOString().split('T')[0];
    database.ref(`logs/${tgl}`).limitToLast(10).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let html = '';
            const keys = Object.keys(data).reverse();
            keys.forEach(waktu => {
                const item = data[waktu];
                const jam = waktu.match(/.{1,2}/g).join(':');

                // 1. Ambil status pompa (default OFF jika tidak ada data)
                const statusPompa = item.pompa || "OFF";
                
                // 2. Tentukan warna status (Hijau untuk ON, Merah untuk OFF)
                const warnaStatus = statusPompa === "ON" ? "#2ecc71" : "#e74c3c";

                html += `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${jam}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.suhu}°C</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.phAir}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.kelembapan}%</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.panelWatt}W</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${warnaStatus}; font-weight: bold;">${statusPompa}</td>
                    </tr>`;
            });
            elements.tabelRiwayat.innerHTML = html;
        } else {
            // Update colspan menjadi 6 karena sekarang ada 6 kolom
            elements.tabelRiwayat.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Belum ada data riwayat hari ini.</td></tr>';
        }
    });
}

// 5. SIMULASI & WAKTU
function startSimulasi() {
    setInterval(() => {
        const sekarang = new Date();
        const tgl = sekarang.toISOString().split('T')[0];
        const wkt = sekarang.toTimeString().split(' ')[0].replace(/:/g, '');

        const dataFiktif = {
            suhu: (25 + Math.random() * 7).toFixed(1),
            phAir: (6.0 + Math.random() * 0.8).toFixed(1),
            kelembapan: Math.floor(65 + Math.random() * 15),
            panelWatt: (50 + Math.random() * 20).toFixed(1),
            panelVolt: (12.2 + Math.random() * 1).toFixed(1),
            panelAmpere: (3.0 + Math.random() * 1).toFixed(2),
            bateraiPersen: Math.floor(85 + Math.random() * 10),
            bateraiVolt: (12.8 + Math.random() * 0.5).toFixed(1),
            // TAMBAHKAN BARIS INI:
            pompa: Math.random() > 0.5 ? "ON" : "OFF" 
        };

        // Mengupdate Firebase
        database.ref('monitoring').set(dataFiktif);
        database.ref(`logs/${tgl}/${wkt}`).set(dataFiktif);
    }, 5000); // Update setiap 5 detik
}

function updateTime() {
    setInterval(() => {
        elements.time.innerText = new Date().toLocaleString('id-ID');
    }, 1000);
}

// 6. INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    listenToData();
    updateTime();
    startSimulasi();
});
function inisialisasiGrafik(idCanvas, label, warna) {
    const ctx = document.getElementById(idCanvas).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: warna,
                backgroundColor: warna + '33', // Tambah transparansi
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function muatGrafik() {
    if (!chartSuhu) {
        chartSuhu = inisialisasiGrafik('grafikSuhu', 'Suhu (°C)', '#e74c3c');
        chartPh = inisialisasiGrafik('grafikPh', 'pH Air', '#3498db');
        chartKelembapan = inisialisasiGrafik('grafikKelembapan', 'Kelembapan (%)', '#2ecc71');
        chartVolt = inisialisasiGrafik('grafikVolt', 'Voltase Panel (V)', '#f1c40f');
    }

    const tgl = new Date().toISOString().split('T')[0];
    database.ref(`logs/${tgl}`).limitToLast(15).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const labels = [], dSuhu = [], dPh = [], dLembap = [], dVolt = [];
            Object.keys(data).forEach(wkt => {
    const item = data[wkt]; // Mengambil satu baris data berdasarkan waktu
    
    // 1. Tambahkan label waktu ke sumbu X grafik
    labels.push(wkt.match(/.{1,2}/g).join(':'));
    
    // 2. Tambahkan data sensor ke variabel grafik masing-masing
    dSuhu.push(parseFloat(item.suhu) || 0);
    dPh.push(parseFloat(item.phAir) || 0);
    dLembap.push(parseFloat(item.kelembapan) || 0);
    dVolt.push(parseFloat(item.panelVolt) || 0);

    // 3. Tambahkan data pompa (Opsional: Jika ingin digunakan untuk logika lain di halaman grafik)
    // Kita simpan statusnya, tapi biasanya tidak dimasukkan ke Chart.js yang bertipe garis (Line Chart)
    const statusPompa = item.pompa || "OFF"; 
});

            chartSuhu.data.labels = labels; chartSuhu.data.datasets[0].data = dSuhu; chartSuhu.update();
            chartPh.data.labels = labels; chartPh.data.datasets[0].data = dPh; chartPh.update();
            chartKelembapan.data.labels = labels; chartKelembapan.data.datasets[0].data = dLembap; chartKelembapan.update();
            chartVolt.data.labels = labels; chartVolt.data.datasets[0].data = dVolt; chartVolt.update();
        }
    });
}   
document.getElementById('btn-download-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Ambil tanggal hari ini untuk judul
    const tgl = new Date().toLocaleDateString('id-ID');

    // Header PDF
    doc.setFontSize(16);
doc.text('LAPORAN MONITORING BIBIT BAWANG MERAH', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tanggal Laporan: ${tgl}`, 14, 30);

    // Ambil data dari tabel HTML
    doc.autoTable({
        html: '#konten-riwayat table', // Mengambil id tabel
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96] }, // Warna hijau tema kamu
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // Download filenya
    doc.save(`Laporan_Monitoring_${tgl.replace(/\//g, '-')}.pdf`);
});