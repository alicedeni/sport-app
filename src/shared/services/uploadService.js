import api from '@shared/services/api.js'

const YANDEX_STORAGE_URL = 'https://storage.yandexcloud.net/team2go'

export const getPresignedFields = async () => {
  const res = await api.get('/img_keys')
  return res.data
}

export const uploadToStorage = async (prefix, file) => {
  const presigned = await getPresignedFields()

  const token = localStorage.getItem('token')
  const userId = token
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()
  const fileName = `${userId}_${timestamp}.${ext}`
  const key = `${prefix}${fileName}`

  const formData = new FormData()
  formData.append('key', key)
  formData.append('X-Amz-Credential', presigned.fields['x-amz-credential'])
  formData.append('acl', 'public-read')
  formData.append('X-Amz-Algorithm', presigned.fields['x-amz-algorithm'] || 'AWS4-HMAC-SHA256')
  formData.append('X-Amz-Date', presigned.fields['x-amz-date'])
  formData.append('policy', presigned.fields['policy'])
  formData.append('X-Amz-Signature', presigned.fields['x-amz-signature'])
  formData.append('file', file)

  const resp = await fetch(YANDEX_STORAGE_URL, { method: 'POST', body: formData })
  if (!resp.ok) throw new Error('File upload failed')
  return `${YANDEX_STORAGE_URL}/${key}`
}

export default { getPresignedFields, uploadToStorage }



