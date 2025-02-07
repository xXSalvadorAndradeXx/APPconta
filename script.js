

    // Obtener el popup
    const popup = document.getElementById("popup");

    // Mostrar con animación
    popup.classList.add("show");

    // Ocultar después de 3 segundos
    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);

    // Eliminar el popup completamente después de la animación
    setTimeout(() => {
      popup.style.display = "none";
    }, 3500); // Espera 500ms adicionales para que termine la transición

    
        document.getElementById('salaryForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que el formulario se envíe
            calculateSalary();
        });
    
        function calculateSalary() {
            const salary = parseFloat(document.getElementById('salary').value);
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const position = document.getElementById('position').value;
    
            // Calcular ISSS
            const isss = salary > 1062.50 ? 30 : salary * 0.03;
    
            // Calcular AFP
            const afp = salary * 0.0725;
    
            // Calcular renta imponible
            const rentaImponible = salary - isss - afp;
    
            // Calcular ISR
            let isr = 0;
            if (rentaImponible > 2038.10) {
                isr = (rentaImponible - 2038.10) * 0.30 + 288.57;
            } else if (rentaImponible > 895.24) {
                isr = (rentaImponible - 895.24) * 0.20 + 60.00;
            } else if (rentaImponible > 472.00) {
                isr = (rentaImponible - 472.00) * 0.10 + 17.67;
            }
    
            // Calcular ISSSpatrono
            const ISSSpatrono = salary > 1062.50 ? 75 : salary * 0.075;
    
            // Calcular AFPpatrono
            const AFPpatrono = salary * 0.0825;
    
            // Calcular totales
            const totalIsss = isss + ISSSpatrono;
            const totalAfp = afp + AFPpatrono;
    
            // Calcular salario líquido
            const salarioLiquido = rentaImponible - isr;
    
            // Mostrar resultados
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <p><strong>Nombre Completo:</strong> ${firstName} ${lastName}</p>
                <p><strong>Cargo:</strong> ${position}</p>
                <p><strong>Salario Bruto:</strong> $${salary.toFixed(2)}</p>
                <p><strong>ISSS (3% ):</strong> $${isss.toFixed(2)}</p>
                <p><strong>AFP (7.25%):</strong> $${afp.toFixed(2)}</p>
                <p><strong>Renta Imponible:</strong> $${rentaImponible.toFixed(2)}</p>
                <p><strong>ISR:</strong> $${isr.toFixed(2)}</p>
                <p><strong>Salario Líquido:</strong> $${salarioLiquido.toFixed(2)}</p>
                <hr>
                <p><strong>ISSS (7.5% ):</strong> $${ISSSpatrono.toFixed(2)}</p>
                <p><strong>AFP (8.75% ):</strong> $${AFPpatrono.toFixed(2)}</p>
                <p><strong>Total ISSS :</strong> $${totalIsss.toFixed(2)}</p>
                <p><strong>Total AFP </strong> $${totalAfp.toFixed(2)}</p>
            `;
    
            // Mostrar el botón de descarga
            document.getElementById('downloadExcel').style.display = 'block';
    
            // Guardar los datos para el Excel
            const data = [
                ["Nombre Completo", "Cargo", "Salario Bruto", "ISSS", "AFP", "Renta Imponible", "ISR", "Salario Líquido", "ISSSpatrono", "AFPpatrono", "Total ISSS", "Total AFP"],
                [`${firstName} ${lastName}`, position, salary.toFixed(2), isss.toFixed(2), afp.toFixed(2), rentaImponible.toFixed(2), isr.toFixed(2), salarioLiquido.toFixed(2), ISSSpatrono.toFixed(2), AFPpatrono.toFixed(2), totalIsss.toFixed(2), totalAfp.toFixed(2)]
            ];
    
            // Configurar el evento de descarga
            document.getElementById('downloadExcel').addEventListener('click', () => {
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.aoa_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Datos de Salario");
                XLSX.writeFile(workbook, "datos_salario.xlsx");
            });
        }