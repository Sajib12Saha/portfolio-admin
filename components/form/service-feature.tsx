'use client'

import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"

interface Props {
  onChange: (services: string[]) => void
  error?: string
  placeholder?:string
  value: string[]; 
}

export const ServiceFeature = ({value, onChange, error, placeholder="Add your service" }: Props) => {
  const [service, setService] = useState("")
  const [services, setServices] = useState<string[]>([])

  const handleAdd = () => {
    const trimmed = service.trim()
    if (!trimmed) return

    const updatedServices = [...services, trimmed]
    setServices(updatedServices)
    setService("")
    onChange(updatedServices)
  }

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index)
    setServices(updatedServices)
    onChange(updatedServices)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-6">
        <Input
          placeholder={placeholder}
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <Button onClick={handleAdd} type="button" className="w-14 self-end">
          Add
        </Button>
      </div>

      {services.length > 0 && (
        <div className="flex flex-col gap-y-3 justify-center">
          {services.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between flex-wrap"
            >
            <p className="flex gap-x-2 items-center"><span className="rounded-full size-3 bg-primary "/> <span>{item}</span></p>
           
              <div
                className="p-1.5 rounded-full shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)]  cursor-pointer hover:bg-background/65 transition-all"
                onClick={() => removeService(index)}
              >
                <Trash2 className="size-4 text-destructive" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
