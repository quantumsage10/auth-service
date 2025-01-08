import fs from 'fs'
import rsaPemToJwk from 'rsa-pem-to-jwk';


const privateKey = fs.readFileSync("./certs/public.pem")
const jwk = rsaPemToJwk(privateKey, {use: "sig"}, "public")

console.log(JSON.stringify(jwk))

// run this file
// output - {"kty":"RSA","use":"sig","n":"AK5wPb1pLlkI_0_I94G-DAZcdzgeSx6Be-kVLYLg_j7VnAaH9xXXmjVA3tuX8cIUji2giuAiJw4YBm1STryBX0DFGKOiCJjR6KHZUhEy3gjWC2opUac3xj78brehq1AEk6eyeU-vTABKPSHRX2YlSfxpYIaJGjxX3QF4Puyz27ZThvTutVcUcMncf6HYJ0eAxjX82iPTzoasZtbLXIMxePMiaPbNHNPhWCxc_xjweB3mcvylIT5ZqUXP4hSANAPVTC1XLFkv01WCAIfZBjgJZSck_WB7RwUQJiSMzLmrcLlpiuw33Ud_bav7DyWUfvvtstK0DThSa5l3eqGqpbKsxBc","e":"AQAB"}
