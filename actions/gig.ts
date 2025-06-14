'use server'
import { db } from "@/lib/db"; // update path as needed
import { PricingInput } from "@/types/type";


 type Package = {
  id: string;
  title: string;
  desc: string;
  price: number;
  features: string[];
};

export type ResponsePricingInput = {
  id: string;
  orderLink?: string;
  basicId: string;
  standardId: string;
  premiumId: string;
  basic: Package;
  standard: Package;
  premium: Package;
  createdAt: Date;
  updatedAt: Date;
};



export const createGig = async (data: PricingInput) => {
  try {
    if (!data) return { status: 400, message: "Data not found" };

    // Create Basic Package
    const basicPackage = await db.package.create({
      data: {
        title: data.basic.title,
        desc: data.basic.desc,
        price: data.basic.price,
        features: data.basic.features.map(f => f.value),
      },
    });

    // Create Standard Package
    const standardPackage = await db.package.create({
      data: {
        title: data.standard.title,
        desc: data.standard.desc,
        price: data.standard.price,
        features: data.standard.features.map(f => f.value),
      },
    });

    // Create Premium Package
    const premiumPackage = await db.package.create({
      data: {
        title: data.premium.title,
        desc: data.premium.desc,
        price: data.premium.price,
        features: data.premium.features.map(f => f.value),
      },
    });

    // Create Gig and connect all three packages
    const gig = await db.gig.create({
      data: {
        orderLink: data.orderLink,
        basicId: basicPackage.id,
        standardId: standardPackage.id,
        premiumId: premiumPackage.id,
      },
    });

    return { status: 200, message: "Gig created successfully"};
  } catch (error) {
    console.error("Error creating gig:", error);
    return { status: 500, message: "Server error" };
  }
};




export const fetchGig = async (): Promise<ResponsePricingInput> => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/gig`, { method: "GET",  });

  if (!res.ok) throw new Error("Failed to fetch gig");

  const data = await res.json(); 
  return data;
};


export const updateGig = async (data: PricingInput, gigId: string) => {
  try {
    if (!data || !gigId) {
      return { status: 400, message: "Data or gigId missing" };
    }

    // Fetch existing gig to get related package IDs
    const existingGig = await db.gig.findUnique({
      where: { id: gigId },
      include: {
        basic: true,
        standard: true,
        premium: true,
      },
    });

    if (!existingGig) {
      return { status: 404, message: "Gig not found" };
    }

    // Update Basic Package
    await db.package.update({
      where: { id: existingGig.basicId },
      data: {
        title: data.basic.title,
        desc: data.basic.desc,
        price: data.basic.price,
        features: data.basic.features.map(f => f.value),
      },
    });

    // Update Standard Package
    await db.package.update({
      where: { id: existingGig.standardId },
      data: {
        title: data.standard.title,
        desc: data.standard.desc,
        price: data.standard.price,
        features: data.standard.features.map(f => f.value),
      },
    });

    // Update Premium Package
    await db.package.update({
      where: { id: existingGig.premiumId },
      data: {
        title: data.premium.title,
        desc: data.premium.desc,
        price: data.premium.price,
        features: data.premium.features.map(f => f.value),
      },
    });

    // Update Gig (only orderLink in this case)
    await db.gig.update({
      where: { id: gigId },
      data: {
        orderLink: data.orderLink,
      },
    });

    return { status: 200, message: "Gig updated successfully" };
  } catch (error) {
    console.error("Error updating gig:", error);
    return { status: 500, message: "Server error" };
  }
};



export const removeGig = async(gigId:string) =>{
    try {
      if(!gigId) return {
         status: 404, message: "Gig Id is required" 
      }
      const deleteGig = await db.gig.delete({
        where:{id:gigId}
      })
      if(!deleteGig)  return { status: 400, message: "Failed to delete Gig" };

       return { status: 200, message: "Gig delete successfully" };
        
    } catch (error) {
        
    }

}

