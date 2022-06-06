<script setup lang="ts">
import { ref, computed } from 'vue'
import ky from 'ky'
import AppParams from './components/AppParams.vue'

interface KeyValue {
  key: string
  value: string
}
const keyValues = ref<KeyValue[]>([
  { key: 'response', value: 'success' },
  { key: '希望店舗', value: '銀座店' },
  { key: '人数', value: '1人' },
  { key: '第1希望', value: '2022/05/31(火)12:00〜14:00' },
  { key: '第2希望', value: '2022/06/01(水)12:00〜14:00' },
])
const key = ref<string>()
const value = ref<string>()

const handleAdd = () => {
  if (key.value && value.value) {
    keyValues.value.push({
      key: key.value,
      value: value.value,
    })

    key.value = ''
    value.value = ''
  }
}

const handleDelete = (key: string) => {
  keyValues.value = keyValues.value.filter((kv) => kv.key !== key)
}

const requestBody = computed(() =>
  keyValues.value.reduce((prev, current) => {
    prev[current.key] = current.value
    return prev
  }, {} as { [key: string]: string })
)
const formResult = ref<string | null>()
const handleSendWebform = async () => {
  formResult.value = null
  formResult.value = await ky
    .post('/api/hello', {
      json: requestBody.value,
    })
    .text()
}
</script>

<template>
  <div
    class="container max-w-4xl mx-auto flex flex-col gap-4 py-4 min-h-screen"
  >
    <div class="flex">
      <div class="text-4xl flex-1">apiCall テスト</div>
      <a target="_blank" href="https://github.com/coji/example-post-form/"
        >source code</a
      >
    </div>

    <div class="flex-1 flex gap-4 items-stretch">
      <div class="flex-1 grid grid-cols-1 gap-4 self-start">
        <div class="flex gap-4 items-end">
          <div class="form-control">
            <label class="label"><span class="label-text">キー</span></label>
            <input
              type="text"
              v-model="key"
              placeholder="店舗名"
              class="input input-bordered input-sm w-full"
            />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">値</span></label>
            <input
              type="text"
              v-model="value"
              placeholder="銀座店"
              class="input input-bordered input-sm w-full"
            />
          </div>

          <button class="btn btn-primary btn-sm" @click="handleAdd">
            追加
          </button>
        </div>

        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th>キー</th>
              <th>値</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kv of keyValues">
              <td>
                {{ kv.key }}
              </td>
              <td>
                {{ kv.value }}
              </td>
              <td>
                <button
                  class="btn btn-xs btn-outline border-none text-slate-400 bg-slate-100"
                  @click="handleDelete(kv.key)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          class="btn btn-primary"
          :disabled="keyValues.length === 0"
          @click="handleSendWebform"
        >
          Web Form 送信
        </button>

        <div class="grid grid-cols-1 gap-2">
          <AppParams
            label="target_api"
            value="https://example-post-form.vercel.app/api/hello"
          />
          <AppParams label="method" value="POST" />
          <AppParams
            label="headers"
            :value="JSON.stringify({ 'content-type': 'application/json' })"
          />
          <AppParams
            label="request_body"
            :value="JSON.stringify(requestBody)"
          />
        </div>
      </div>

      <div
        class="flex-1 bg-slate-800 text-slate-200 p-4 whitespace-pre overflow-scroll rounded"
      >
        {{ formResult ? formResult : formResult !== null ? '' : 'Loading...' }}
      </div>
    </div>
  </div>
</template>
