document.addEventListener("DOMContentLoaded", function () {
    // Traduzindo placeholder {Ydate}
    const YdatePlaceholder = document.getElementById("Ydate");
    if (YdatePlaceholder) {
        const date = new Date();
        YdatePlaceholder.innerHTML = "&nbsp;" + date.getFullYear() + "&nbsp;";
    }

    // Código do submenu do usuário
    const userIcon = document.getElementById("user-icon");
    const userSubmenu = document.getElementById("user-submenu");

    // Responsável por exibir e ocultar o submenu do usuário
    if (userIcon && userSubmenu) {
        userIcon.addEventListener("click", function (event) {
            event.preventDefault();
            if (userSubmenu.style.display === "block") {
                userSubmenu.style.display = "none";
            } else {
                userSubmenu.style.display = "block";
            }
        });

        window.addEventListener("click", function (event) {
            if (!userIcon.contains(event.target) && !userSubmenu.contains(event.target)) {
                userSubmenu.style.display = "none";
            }
        });
    }

    // Código para ordenar a tabela de veículos
    const table = document.getElementById("vehicleTable");
    if (table) {
        const headers = table.getElementsByTagName("th");
        let sortState = Array(headers.length).fill("asc"); // Mantém estado de ordenação para cada coluna
        const kmElements = document.getElementsByClassName("km");
        const priceElements = document.getElementsByClassName("price");

        // Formata os preços e quilômetros na tabela
        Array.from(priceElements).forEach(el => {
            let value = parseFloat(el.textContent.replace(/\D/g, "")); // Remove caracteres não numéricos e ajusta centavos
            el.textContent = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        });

        Array.from(kmElements).forEach(el => {
            let value = parseInt(el.textContent.replace(/\D/g, ""), 10); // Remove caracteres não numéricos
            el.textContent = value.toLocaleString("pt-BR") + " km";
        });

        function sortTable(n) {
            const rows = Array.from(table.rows).slice(1); // Pega todas as linhas, exceto o cabeçalho
            const dir = sortState[n]; // Obtém direção atual da coluna
            const multiplier = dir === "asc" ? 1 : -1;

            rows.sort((rowA, rowB) => {
                let x = rowA.getElementsByTagName("TD")[n].textContent.trim();
                let y = rowB.getElementsByTagName("TD")[n].textContent.trim();

                // Normaliza os valores para número, removendo " km" e pontos de milhar
                const normalizeNumber = (str) => {
                    return parseFloat(str.replace(/\./g, "").replace(" km", "").replace("R$", "").replace(",", "."));
                };

                const xValue = isNaN(normalizeNumber(x)) ? x : normalizeNumber(x);
                const yValue = isNaN(normalizeNumber(y)) ? y : normalizeNumber(y);

                if (xValue > yValue) return 1 * multiplier;
                if (xValue < yValue) return -1 * multiplier;
                return 0;
            });

            // Atualiza a tabela com as linhas ordenadas
            const tbody = table.getElementsByTagName("tbody")[0];
            rows.forEach(row => tbody.appendChild(row));

            // Alterna a direção de ordenação
            sortState[n] = dir === "asc" ? "desc" : "asc";

            // Remover classe 'active' de todas as colunas
            Array.from(headers).forEach(header => header.classList.remove("active"));
            // Adiciona classe 'active' para a coluna ordenada
            headers[n].classList.add("active");
        }

        // Adicionar eventos de clique aos cabeçalhos
        Array.from(headers).forEach((header, index) => {
            header.addEventListener("click", function () {
                sortTable(index);
            });
        });
    }



    // log para verificar se o script foi carregado
    console.log("Manipulator.js carregado com sucesso!");
});