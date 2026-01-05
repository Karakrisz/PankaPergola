<script setup>
import { ref, onMounted } from 'vue'

useHead({
  title: 'Bioklimatikus Pergola & Árnyékolás - Ingyenes Felmérés',
})

// ====== GOOGLE ADS TRACKING ======
function persistClickIdsFromUrl() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  ;['gclid', 'wbraid', 'gbraid'].forEach((key) => {
    const v = params.get(key)
    if (v) localStorage.setItem(key, v)
  })
}

function getClickIds() {
  if (typeof window === 'undefined')
    return { gclid: null, wbraid: null, gbraid: null }
  return {
    gclid: localStorage.getItem('gclid'),
    wbraid: localStorage.getItem('wbraid'),
    gbraid: localStorage.getItem('gbraid'),
  }
}

// Reactive variables
const isSubmitting = ref(false)
const submitMessage = ref('')
const formData = ref({
  propertyType: '',
  service: '',
  teraszSize: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  message: '',
})

// Form submission handler
const submitForm = async (event) => {
  event.preventDefault()

  if (isSubmitting.value) return

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    const webhookUrl =
      'https://services.leadconnectorhq.com/hooks/B7BReg5ssaEIc5vHLzo0/webhook-trigger/794b8f30-bb72-4eb9-94d8-e779c8780fd0'

    // ✅ Kattintás-azonosítók begyűjtése
    const { gclid, wbraid, gbraid } = getClickIds()
    const serviceName = getServiceDisplayName(formData.value.service)

    // Prepare data for GoHighLevel
    const payload = {
      // Contact information
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address,

      // Property information
      property_type: formData.value.propertyType,
      service_type: formData.value.service,
      terasz_size: formData.value.teraszSize,

      // Additional message
      message: formData.value.message,

      // ✅ GOOGLE ADS ATTRIBUTION
      gclid,
      wbraid,
      gbraid,

      // Additional metadata
      source: 'Pergola ajánlatkérési űrlap',
      form_type: 'pergola_booking',
      submission_date: new Date().toISOString(),

      // Custom fields for GoHighLevel
      custom_field_1: serviceName,
      custom_field_2: formData.value.propertyType,
      custom_field_3: formData.value.teraszSize,
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      submitMessage.value =
        '✅ Sikeres ajánlatkérés! Munkanapokon 24 órán belül felvesszük Önnel a kapcsolatot.'

      // Reset form
      formData.value = {
        propertyType: '',
        service: '',
        teraszSize: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        message: '',
      }
    } else {
      throw new Error('Hiba történt a küldés során')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    submitMessage.value =
      '❌ Hiba történt. Kérjük próbálja újra, vagy hívjon minket!'
  } finally {
    isSubmitting.value = false
  }
}

// Helper function to get service display name
const getServiceDisplayName = (serviceValue) => {
  const serviceMap = {
    'bioklimatikus-pergola': 'Bioklimatikus pergola',
    'markizo-arnyekolo': 'Markíz árnyékolás',
    'redony-arnyekolo': 'Redőny árnyékolás',
    'pergola-automatika': 'Pergola automatika felszerelés',
    'terasz-fedetteses': 'Teraszfedettesítés',
    'alom-arnyekolo': 'Almen árnyékolás',
    'roller-pergola': 'Roller pergola',
    'konzol-pergola': 'Konzol pergola',
  }
  return serviceMap[serviceValue] || serviceValue
}

// ✅ URL-ből paraméterek mentése az oldal betöltésekor
const initPage = () => {
  persistClickIdsFromUrl()

  // Header és footer elrejtése
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  const navbar = document.querySelector('nav')
  const siteChatWidget = document.querySelector('.lc_text-widget')

  if (header) header.style.display = 'none'
  if (footer) footer.style.display = 'none'
  if (navbar) navbar.style.display = 'none'
  if (siteChatWidget) siteChatWidget.style.display = 'none'
  // Alternatív selectorok
  document.querySelectorAll('header, footer, .lc_text-widget').forEach((el) => {
    el.style.display = 'none'
  })
}

onMounted(() => {
  initPage()
})
</script>

<template>
  <section>
    <div
      class="about-content about-content--subpage-next-format position-relative no-header-footer-page"
    >
      <div class="subpage-content">
        <!-- Fő üzenet -->
        <div class="trust-banner">
          <h2 class="page-color main-title">
            BIOKLIMATIKUS PERGOLÁK ÉS ÁRNYÉKOLÁS
          </h2>
          <p class="banner-subtitle">
            <i class="supage-content__p__i"
              >Egész éves kényelem és energiahatékonyság a teraszán</i
            >
          </p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Időjárásfüggetlen kültéri élet</h3>
            <p>
              <strong>Rugalmas megoldás</strong> - Mozgatható lamellák
              biztosítják az optimális feltételeket minden időben
            </p>
          </div>
          <div class="benefit-card">
            <h3>Intelligens klímaszabályozás</h3>
            <p>
              <strong>Okos árnyékolás</strong> - Automatizálható, amely
              csökkenti a fűtési és hűtési költségeket
            </p>
          </div>
          <div class="benefit-card">
            <h3>Prémium megjelenés</h3>
            <p>
              <strong>Elegáns design</strong> - Tartós alumínium, tetszőleges
              RAL szín, bármilyen építészeti stílushoz illeszkedik
            </p>
          </div>
        </div>

        <h2 class="page-color section-heading">
          KÉRJEN INGYENES FELMÉRÉST ÉS AJÁNLATOT
        </h2>

        <form class="appointment-form" @submit="submitForm">
          <!-- Ingatlan adatok -->
          <div class="form-section">
            <h3 class="section-title">Ingatlan adatok</h3>

            <div class="form-group">
              <label class="supage-content__ul__li__strong"
                >Ingatlan típusa *</label
              >
              <select
                v-model="formData.propertyType"
                required
                class="form-select"
                :disabled="isSubmitting"
              >
                <option value="">Válasszon ingatlan típust...</option>
                <option value="csaladi-haz">Családi ház</option>
                <option value="lakaspark">Lakáspark / Lakóépület</option>
                <option value="panzio-hotel">Panzió / Hotel</option>
                <option value="iroda">Iroda / Üzlet</option>
                <option value="etterem-kavezo">Étterem / Kávézó</option>
                <option value="kulonleges">Egyéb / Különleges</option>
              </select>
            </div>
          </div>

          <!-- Pergola/Árnyékolás típusa -->
          <div class="form-section">
            <h3 class="section-title">Milyen megoldásra van szüksége?</h3>

            <div class="form-group">
              <label class="supage-content__ul__li__strong"
                >Pergola/Árnyékolás típusa *</label
              >
              <select
                v-model="formData.service"
                required
                class="form-select"
                :disabled="isSubmitting"
              >
                <option value="">Válasszon típust...</option>
                <option value="bioklimatikus-pergola">
                  Bioklimatikus pergola
                </option>
                <option value="markizo-arnyekolo">Markíz árnyékolás</option>
                <option value="redony-arnyekolo">Redőny árnyékolás</option>
                <option value="pergola-automatika">
                  Pergola automatika felszerelés
                </option>
                <option value="terasz-fedetteses">Teraszfedettesítés</option>
                <option value="alom-arnyekolo">Almen árnyékolás</option>
                <option value="roller-pergola">Roller pergola</option>
                <option value="konzol-pergola">Konzol pergola</option>
              </select>
            </div>

            <div class="form-group">
              <label class="supage-content__ul__li__strong"
                >Terasz mérete (m²)</label
              >
              <input
                type="number"
                v-model="formData.teraszSize"
                class="form-input"
                placeholder="Pl. 20 m²"
                min="1"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Személyes adatok -->
          <div class="form-section">
            <h3 class="section-title">Személyes adatok</h3>

            <div class="form-group">
              <label class="supage-content__ul__li__strong">Név *</label>
              <input
                type="text"
                v-model="formData.name"
                required
                class="form-input"
                placeholder="Teljes név"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label class="supage-content__ul__li__strong">Email cím *</label>
              <input
                type="email"
                v-model="formData.email"
                required
                class="form-input"
                placeholder="Az ajánlatot ide küldjük"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label class="supage-content__ul__li__strong"
                >Telefonszám *</label
              >
              <input
                type="tel"
                v-model="formData.phone"
                required
                class="form-input"
                placeholder="Gyors egyeztetéshez"
                :disabled="isSubmitting"
              />
            </div>

            <div class="form-group">
              <label class="supage-content__ul__li__strong">Cím *</label>
              <input
                type="text"
                v-model="formData.address"
                required
                class="form-input"
                placeholder="A felmérés helyszíne"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- További információ -->
          <div class="form-section">
            <h3 class="section-title">Megjegyzés (opcionális)</h3>

            <div class="form-group">
              <label class="supage-content__ul__li__strong"
                >Egyéb információ</label
              >
              <textarea
                v-model="formData.message"
                class="form-textarea"
                placeholder="Írja le igényeit: szín, anyag, automatika, kiváló időpont, stb."
                rows="4"
                :disabled="isSubmitting"
              ></textarea>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span class="btn-text" v-if="!isSubmitting"
              >Ajánlatkérés elküldése</span
            >
            <span class="btn-text" v-else>Küldés...</span>
          </button>
          <p class="page-color privacy-text">
            <i class="supage-content__p__i">
              Az ajánlatkérés elküldésével automatikusan elfogadja az
              <NuxtLink
                class="supage-content__nlink"
                to="/adatvedelmi-tajekoztato"
                >Adatvédelmi Szabályzatot.</NuxtLink
              >
            </i>
          </p>
        </form>
        <!-- Success/Error Message -->
        <div
          v-if="submitMessage"
          class="submit-message"
          :class="{
            success: submitMessage.includes('✅'),
            error: submitMessage.includes('❌'),
          }"
        >
          {{ submitMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Header és footer elrejtése - nem scoped */
header,
footer,
.header,
.footer,
nav,
.navbar,
.site-header,
.site-footer {
  display: none !important;
}

body > header,
body > footer {
  display: none !important;
}
.subpage-content {
  padding: 3em;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.main-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #f9f5f2;
}

.banner-subtitle {
  font-size: 1.1rem;
  text-align: center;
  color: #f9f5f2;
  margin-bottom: 25px;
  opacity: 0.95;
}

.trust-banner {
  background: linear-gradient(180deg, #971e20 0%, #5a0001 100%);
  color: #f9f5f2;
  padding: 3.5em;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(139, 0, 0, 0.2);
}

.trust-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 25px;
}

.trust-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(249, 245, 242, 0.12);
  padding: 18px;
  border-radius: 12px;
  border-left: 4px solid #f9f5f2;
  transition: all 0.3s ease;
  flex-direction: column;
}

.trust-item:hover {
  background: rgba(249, 245, 242, 0.18);
  transform: translateX(5px);
}

.trust-icon {
  font-size: 1.8rem;
  font-weight: bold;
  color: #f9f5f2;
  min-width: 30px;
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 35px 0;
  padding: 1em 0;
}

.benefit-card {
  background: #f9f5f2;
  padding: 25px;
  border-radius: 12px;
  border-top: 5px solid #8b0000;
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(139, 0, 0, 0.15);
}

.benefit-card h3 {
  color: #8b0000;
  font-size: 1.1rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.benefit-card p {
  color: #333;
  line-height: 1.6;
}

.section-heading {
  color: #8b0000;
  font-size: 2rem;
  font-weight: bold;
  margin: 40px 0 30px 0;
  text-align: center;
}

.appointment-form {
  max-width: 900px;
  margin: 0 auto;
}

.submit-message {
  padding: 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 1rem;
}

.submit-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.submit-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.form-section {
  background: #f9f5f2;
  padding: 28px;
  margin: 3em 0 2.5em 0;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(139, 0, 0, 0.08);
  border-left: 5px solid #8b0000;
}

.section-title {
  color: #8b0000;
  font-size: 1.35rem;
  margin-bottom: 25px;
  border-bottom: 3px solid #971e20;
  padding-bottom: 12px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 13px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
  background-color: #fff;
  color: #333;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #999;
}

.form-select {
  width: 100%;
  padding: 13px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #333;

  /* Custom arrow eltávolítása */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Saját nyíl hozzáadása */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  padding-right: 45px;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #8b0000;
  outline: none;
  box-shadow: 0 0 0 4px rgba(139, 0, 0, 0.1);
}

.form-select:focus {
  border-color: #8b0000;
  outline: none;
  box-shadow: 0 0 0 4px rgba(139, 0, 0, 0.1);

  /* Focus esetén piros nyíl */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b0000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.form-select:hover:not(:disabled) {
  border-color: #8b0000;
  background-color: #fefefe;
}

.form-input:disabled,
.form-textarea:disabled,
.form-select:disabled {
  background-color: #f0f0f0;
  opacity: 0.65;
  cursor: not-allowed;
}

.form-select:disabled {
  /* Disabled állapotban szürke nyíl */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}

.submit-btn {
  background: linear-gradient(135deg, #8b0000 0%, #5a0001 100%);
  color: #f9f5f2;
  border: none;
  padding: 18px 45px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  box-shadow: 0 6px 20px rgba(139, 0, 0, 0.25);
  margin-top: 15px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 0, 0, 0.35);
  background: linear-gradient(135deg, #971e20 0%, #8b0000 100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-text {
  font-size: 1.05rem;
  letter-spacing: 0.5px;
}

.privacy-text {
  color: #666;
  font-size: 0.85rem;
  margin-top: 15px;
  text-align: center;
}

.privacy-text a {
  color: #8b0000;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.privacy-text a:hover {
  color: #5a0001;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }

  .banner-subtitle {
    font-size: 0.95rem;
  }

  .trust-elements {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .trust-item {
    padding: 15px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .benefit-card {
    padding: 20px;
  }

  .form-section {
    padding: 20px;
  }

  .section-heading {
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.15rem;
  }

  .submit-btn {
    padding: 16px 35px;
    font-size: 1rem;
  }

  .subpage-content {
    padding: 1.5em;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
  }

  .trust-banner {
    padding: 2em;
  }

  .trust-item {
    gap: 10px;
    flex-wrap: wrap;
  }

  .trust-icon {
    font-size: 1.5rem;
  }

  .benefits-grid {
    gap: 33px;
  }

  .benefit-card {
    padding: 15px;
  }

  .benefit-card h3 {
    font-size: 1.1rem;
  }

  .subpage-content {
    padding: 1em;
  }
}

/* Safari specifikus javítások */
@supports (-webkit-appearance: none) {
  .form-select {
    padding-right: 40px;
  }
}

/* Firefox specifikus javítások */
@-moz-document url-prefix() {
  .form-select {
    padding-right: 42px;
  }
}
</style>
