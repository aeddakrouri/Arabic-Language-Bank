import { supabase } from "../lib/supabase"

const submit = async () => {

await supabase
.from("submissions")
.insert([
{
full_name,
email,
phone,
book_title,
specialization,
abstract
}
])

}
