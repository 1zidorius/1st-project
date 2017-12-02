#primityvus skaiciuotuvas
#!/bin/bash

echo "Iveskite pirmaji skaiciu: "
read sk1
echo "Iveskite antraji skaiciu: "
read sk2
echo "Kokia norite atlikti operacija tarp siu skaiciu?"

echo "1)Sudetis"
echo "2)Atimtis"
echo "3)Daugyba"
echo "4)Dalyba"
read ats

case $ats in
1) echo "Atsakymas: $((sk1+sk2))"
2) echo "Atsakymas: $((sk1-sk2))"
3) echo "Atsakymas: $((sk1*sk2))"
4) echo "Atsakymas: $((sk1+/sk2))"
