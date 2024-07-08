<template>
  <div>
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <h3 class="text-[24px] font-bold">Create Order</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <el-select
          size="large"
          v-model="order.sourceId"
          placeholder="Поставщик"
        >
          <el-option
            v-for="(item, index) in suppliersList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select
          size="large"
          v-model="order.destinationId"
          placeholder="Локация"
        >
          <el-option
            v-for="(item, index) in locationsList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select
          size="large"
          v-model="order.paymentType"
          placeholder="Тип оплаты"
        >
          <el-option
            v-for="(item, index) in paymentType"
            :value="item?.value"
            :label="item?.label"
            :key="index"
          />
        </el-select>
        <el-button type="primary" size="large"> Create Order </el-button>
      </div>

      <el-dialog v-model="dialog" width="80%">
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          ease-in-out
          class="mt-4 h-[300px] overflow-y-scroll"
          :headers="tempHeaders"
          :items="templateProducts"
        >
          <template #item-opera="item">
            <div class="flex items-center gap-2">
              <el-icon
                @click="removeItem(item)"
                class="cursor-pointer"
                size="large"
                ><Delete
              /></el-icon>
            </div>
          </template>
        </Vue3EasyDataTable>

        <div class="flex items-center justify-end my-3">
          <el-button @click="saveProducts" type="primary" class="w-[100px]"
            >Save</el-button
          >
        </div>

        <div class="mt-4">
          <el-input
            placeholder="Поиск"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <Vue3EasyDataTable
            buttons-pagination
            :headers="headers"
            class="h-[500px] overflow-y-auto"
            :items="items"
            :search-field="[
              'id',
              'name',
              'description',
              'manufacturer',
              'origin',
              'carModel',
              'carYear',
              'group',
              'partNumber',
              'manualCode',
              'weight',
            ]"
            :search-value="searchValue"
          >
            <template #item-image="item">
              <div class="py-3">
                <el-image
                  style="width: 80px; height: 60px"
                  :src="`data:image/jpeg;base64,${item.image}`"
                  :zoom-rate="1.0"
                  :max-scale="5"
                  :min-scale="0.2"
                  :preview-src-list="[`data:image/jpeg;base64,${item.image}`]"
                  :initial-index="4"
                  fit="cover"
                />
              </div>
            </template>
            <template #item-opera="item">
              <div class="flex items-center">
                <el-button
                  @click="addProduct(item)"
                  size="small"
                  class="!p-2 !ml-[8px]"
                  type="primary"
                >
                  Добавить
                </el-button>
              </div>
            </template>
          </Vue3EasyDataTable>

          <el-dialog
            v-model="innerVisible"
            width="500"
            title="Inner Dialog"
            append-to-body
          >
            <div class="flex items-center gap-2">
              <el-input
                class="!w-[150px]"
                placeholder="Quantity"
                v-model="quantity"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Net price"
                v-model="costPrice"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Sale price"
                v-model="salePrice"
              />
            </div>

            <template #footer>
              <el-button type="primary" @click="updCount">Save</el-button>
            </template>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { getCustomers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types.ts'

const suppliersList: Ref<ISuppliers[] | undefined> = ref()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})

onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
})
</script>
<style scoped></style>
