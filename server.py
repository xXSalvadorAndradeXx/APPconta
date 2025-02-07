from flask import Flask, render_template, request, jsonify
import openpyxl
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('calculadora.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    first_name = data['firstName']
    last_name = data['lastName']
    position = data['position']
    salary = float(data['salary'])

    # Calcular ISSS
    isss = 30 if salary > 1062.50 else salary * 0.03

    # Calcular AFP
    afp = salary * 0.0725

    # Calcular renta imponible
    renta_imponible = salary - isss - afp

    # Calcular ISR
    isr = 0
    if renta_imponible > 2038.10:
        isr = (renta_imponible - 2038.10) * 0.30 + 288.57
    elif renta_imponible > 895.24:
        isr = (renta_imponible - 895.24) * 0.20 + 60.00
    elif renta_imponible > 472.00:
        isr = (renta_imponible - 472.00) * 0.10 + 17.67

    # Calcular ISSSpatrono
    isss_patrono = 75 if salary > 1062.50 else salary * 0.075

    # Calcular AFPpatrono
    afp_patrono = salary * 0.0825

    # Calcular totales
    total_isss = isss + isss_patrono
    total_afp = afp + afp_patrono

    # Calcular salario líquido
    salario_liquido = renta_imponible - isr

    result = {
        "nombre_completo": f"{first_name} {last_name}",
        "cargo": position,
        "salario_bruto": round(salary, 2),
        "isss": round(isss, 2),
        "afp": round(afp, 2),
        "renta_imponible": round(renta_imponible, 2),
        "isr": round(isr, 2),
        "salario_liquido": round(salario_liquido, 2),
        "isss_patrono": round(isss_patrono, 2),
        "afp_patrono": round(afp_patrono, 2),
        "total_isss": round(total_isss, 2),
        "total_afp": round(total_afp, 2)
    }

    return jsonify(result)

@app.route('/download', methods=['POST'])
def download():
    data = request.json

    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Datos de Salario"

    headers = [
        "Nombre Completo", "Cargo", "Salario Bruto", "ISSS", "AFP",
        "Renta Imponible", "ISR", "Salario Líquido", "ISSS Patrono",
        "AFP Patrono", "Total ISSS", "Total AFP"
    ]
    sheet.append(headers)

    values = [
        data['nombre_completo'], data['cargo'], data['salario_bruto'],
        data['isss'], data['afp'], data['renta_imponible'], data['isr'],
        data['salario_liquido'], data['isss_patrono'], data['afp_patrono'],
        data['total_isss'], data['total_afp']
    ]
    sheet.append(values)

    output = BytesIO()
    workbook.save(output)
    output.seek(0)

    return (output.getvalue(), 
            200,
            {
                'Content-Disposition': 'attachment; filename="datos_salario.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

if __name__ == '__main__':
    app.run(debug=True)
