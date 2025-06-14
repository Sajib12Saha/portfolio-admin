'use server'

import { db } from "@/lib/db"
import { ServiceInput, ServiceResponseType } from "@/types/type"


export type PaginatedServicesResponse = {
  data: ServiceResponseType[];
};

export const createService = async(data:ServiceInput) =>{
  
    try {
           if(!data)return {status:400,message:"data is not found" }
           const res = await db.service.create({
            data:{
           ...data,
           services:data.services.map((f)=>f.value)
            }
           })
           if(!res)return{
            status:404,
            message:"Failed to create service"
           }
           return{status:200, message:"Service to create successfully"}
    } catch (error) {
        return {status:500,message:"Someting wrong in server"}
    }

}


export const getServices = async ():Promise<PaginatedServicesResponse> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/services`, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to load services");
  return await res.json();
};



export const updateService = async (data: ServiceInput, serviceId: string) => {
  try {
    if (!serviceId || !data) {
      return {
        status: 404,
        message: "Service ID and data are required",
      };
    }

    const updatedService = await db.service.update({
      where: {
        id: serviceId,
      },
      data: {
        ...data,
        services: data.services.map((f) => f.value),
      },
    });

    if (!updatedService) {
      return {
        status: 400,
        message: "Failed to update service",
      };
    }

    return {
      status: 200,
      message: "Service updated successfully",
    };
  } catch (error) {
    console.error("Error updating service:", error);
    return {
      status: 500,
      message: "Something went wrong on the server",
    };
  }
};


export const deleteService = async(serviceId:string) =>{
    try {
      if(!serviceId) return{
        status:404,
        message:"Service Id is required"
      }
      const removeService = await db.service.delete({
        where:{id:serviceId}
      })
        if(!removeService)return{
          status:400,
          message:"Failed to delete service"
        }
        return{

          status:200,
          message:"Service Delete sucessfully"
        }
    } catch (error) {
        
    }

}

