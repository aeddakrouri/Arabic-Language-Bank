import { useState } from "react"
import { supabase } from "../lib/supabase"

type FormData = {
  full_name: string
  email: string
  phone: string
  book_title: string
  specialization: string
  abstract: string
}

export default function SubmitBook() {

  const [form, setForm] = useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    book_title: "",
    specialization: "",
    abstract: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      book_title: form.book_title,
      specialization: form.specialization,
      abstract: form.abstract
    }

    const { error } = await supabase
      .from("book_submissions")
      .insert([payload])

    if (error) {
      alert("حدث خطأ أثناء الإرسال")
      console.error(error)
    } else {
      alert("تم إرسال الطلب بنجاح")
      setForm({
        full_name: "",
        email: "",
        phone: "",
        book_title: "",
        specialization: "",
        abstract: ""
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">

      <input
        type="text"
        name="full_name"
        placeholder="الاسم الكامل"
        value={form.full_name}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="البريد الإلكتروني"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="رقم الهاتف"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="text"
        name="book_title"
        placeholder="عنوان الكتاب"
        value={form.book_title}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="text"
        name="specialization"
        placeholder="التخصص"
        value={form.specialization}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <textarea
        name="abstract"
        placeholder="ملخص الكتاب"
        value={form.abstract}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        إرسال
      </button>

    </form>
  )
}