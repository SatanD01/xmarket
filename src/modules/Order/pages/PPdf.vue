<template>
  <div
    v-if="data"
    ref="printableArea"
    id="printableArea"
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
                <div>Магазин: {{ data?.source?.name }}</div>
                <div>Клинент: {{ data?.destination?.name }}</div>
                <div>Номер клинент: +{{ data?.destination?.phone }}</div>
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
        <tr v-for="(item, index) in data?.items" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.product.name }}</td>
          <td>{{ item.product.manufacturer }}</td>
          <td>{{ item.quantity }}</td>
          <td>шт</td>
          <td>{{ item.salePrice }}</td>
          <td>{{ item.salePrice * item.quantity }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="total-label">Итого</td>
          <td class="total-value">{{ totalProfitPrice.sale }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getSaleOrders } from '@/modules/Order/controller'
const route = useRoute()
const printableArea = ref(null)
const router = useRouter()
const data = ref(null)
const printTable = async () => {
  await nextTick()
  if (printableArea.value) {
    window.print()
  }
  setTimeout(() => {
    router.push({ name: 'PCreateOrder' })
  }, 500)
}
const totalProfitPrice = computed(() => {
  if (!data.value?.items) return { sale: 0 }
  return {
    sale: data.value.items.reduce(
      (total, el) => total + el.salePrice * el.quantity,
      0,
    ),
  }
})
onMounted(async () => {
  const res = await getSaleOrders()
  data.value = res.find((el) => el?.id == route.query?.id)
  await printTable()
  // window.onafterprint = () => {
  //   router.push('/create-order')
  // }
})
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
</style>
