## 我想做什么？

<ClientOnly>
  <div class="scenario-entry">
    <h3>从用户痛点出发，找到适合你的工具</h3>
    <div class="scenario-grid">
      
    </div>
  </div>
</ClientOnly>

<script setup>
function navigate(path) {
  window.location.href = path;
}
</script>

<style scoped>
.scenario-entry {
  margin: 3rem 0;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
}

.scenario-entry h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #111827;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.scenario-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.scenario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.scenario-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.scenario-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  
  .scenario-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>