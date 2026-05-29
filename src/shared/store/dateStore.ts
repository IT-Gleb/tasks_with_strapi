import { create } from "zustand"
import { TDateISOString } from "../types/main_types"
import { makeDateISOStringFromNow } from "../utils/functions"

type TDateStore={
    currentDate: TDateISOString
}

interface IDateActions{
    setCurrentDate:(param:TDateISOString)=>void
}

const useDateStore= create<TDateStore & IDateActions>((set)=>({
    currentDate: makeDateISOStringFromNow(),
    setCurrentDate:(param:TDateISOString)=> set({currentDate: param})

}))

export default useDateStore;