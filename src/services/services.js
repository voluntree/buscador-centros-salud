import { WrapperCV } from "./wrappers";


export function arrayAJsonCV(array) {
  let json = {};
  array.forEach((element) => {
    let elem = WrapperCV(JSON.stringify(element));
    json[elem.nombre] = elem;
  });

  return json;
}

export async function upload(){
  
}
