import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  fields: { id: string; value: string }[]
  append: (value: { value: string }) => void
  remove: (index: number) => void
  error?: string
  placeHolder?:string;
}

export const OrderFeature = ({ fields, append, remove, error, placeHolder="Add your service" }: Props) => {
  const [feature, setFeature] = useState("")

  const handleAdd = () => {
    const trimmed = feature.trim()
    if (!trimmed) return

    append({ value: trimmed })
    setFeature("")
  }

  return (
    <div className="space-y-3">
      {/* Input and Add Button */}
      <div className="flex flex-col md:flex-row gap-6">
        <Input
          placeholder={placeHolder}
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
        />
        <Button onClick={handleAdd} type="button" className="w-14 self-end">
          Add
        </Button>
      </div>

      {/* Render Features */}
      {fields.length > 0 && (
        <div className="flex flex-col gap-y-3 justify-center">
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between flex-wrap">
              <div className="flex gap-x-2 items-center">
                <div className="rounded-full size-3 bg-primary shrink-0" />
                <p>{item.value}</p>
              </div>
              <div
                className="p-1.5 rounded-full shadow hover:bg-background/65 transition-all cursor-pointer"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4 text-destructive" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
