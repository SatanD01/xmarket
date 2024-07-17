<template>
  <el-button @click="printTable" type="primary" class="mb-4 flex items-center"
    ><Printer :size="15" class="me-2" />Экспорт</el-button
  >
  <div
    ref="printableArea"
    class="bg-white p-3 shadow rounded-lg printable-area"
  >
    <table class="auto-parts-table">
      <thead>
        <tr>
          <th colspan="7" class="header">
            <div class="text-black grid grid-cols-12 items-center">
              <div class="header-title text-orange-600 col-span-4">
                ENERGY AUTO PARTS
              </div>
              <div class="header-contacts col-span-4">
                <div>+998954441414</div>
                <div>+998983381911</div>
              </div>
              <div class="header-model col-span-4">
                <div>Магазин: BYD SONG PLUS EV</div>
                <div>Клинент: BYD SONG PLUS EV</div>
                <div>Номер клинент: +998999999999</div>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <th>№</th>
          <th>Наименования товара</th>
          <th>Модель</th>
          <th>Количе ство</th>
          <th>Ед-из</th>
          <th>Цена</th>
          <th>ОБЩ</th>
        </tr>
      </thead>
      <tbody>
        <!-- Add rows here -->
        <tr>
          <td>1</td>
          <td>Капот передняя</td>
          <td>BYD SONG PLUS EV</td>
          <td>1</td>
          <td>шт</td>
          <td>750</td>
          <td>750</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Фара передняя LH</td>
          <td>BYD SONG PLUS EV</td>
          <td>1</td>
          <td>шт</td>
          <td>650</td>
          <td>650</td>
        </tr>
        <!-- Continue for all rows -->
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="total-label">Итого</td>
          <td class="total-value">4210</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Printer } from 'lucide-vue-next'
import { nextTick, ref } from 'vue'

const printableArea = ref(null)

const printTable = async () => {
  await nextTick()
  if (printableArea.value) {
    const printContents = printableArea.value.innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
    location.reload() // To restore original page state
  } else {
    alert('error')
  }
}
</script>

<style scoped>
.auto-parts-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;
}

.auto-parts-table th,
.auto-parts-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.auto-parts-table th.header {
  background-color: #f2f2f2;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.header-contacts,
.header-model {
  font-size: 18px;
  margin-bottom: 10px;
}

.auto-parts-table th {
  background-color: #f2f2f2;
  color: black;
}

.auto-parts-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.auto-parts-table tr:hover {
  background-color: #f1f1f1;
}

.auto-parts-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #4caf50;
  color: white;
  text-align: center;
}

.auto-parts-table td {
  text-align: center;
}

tfoot td {
  font-weight: bold;
}

tfoot .total-label {
  text-align: right;
}

tfoot .total-value {
  text-align: center;
  background-color: #f2f2f2;
}

@media print {
  body {
    visibility: hidden;
    background-color: white;
  }
  .printable-area,
  .printable-area * {
    visibility: visible;
  }
  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .header-contacts,
  .header-model {
    font-size: 14px;
  }
}
</style>
