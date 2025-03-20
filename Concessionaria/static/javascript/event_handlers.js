document.addEventListener("DOMContentLoaded", function () {
    // Carregamento de foto do formulário de cadastro
    const photoInput = document.getElementById("profilePhoto");
    if (photoInput) {
        photoInput.addEventListener("change", function (event) {
            const preview = document.getElementById("preview");
            if (preview) {
                preview.src = URL.createObjectURL(event.target.files[0]);
                // Exibe a imagem de pré-visualização
                preview.style.display = "block";
            }
        });

        const preview = document.getElementById("preview");
        if (preview) {
            preview.addEventListener("click", function () {
                // Permite clicar na imagem para escolher novamente
                photoInput.click();
            });
        }
    }

    // Desabilita o campo de endereço de entrega caso a opção de entrega seja "Não"
    const entregaSelect = document.getElementById("entregaSelect");
    if (entregaSelect) {
        entregaSelect.addEventListener("change", function () {
            const selectValue = this.value;
            const enderecoInput = document.getElementById("deliveryAdress");

            if (selectValue === "Não") {
                enderecoInput.disabled = true;
                enderecoInput.value = "Você selecionou a opção de retirada na loja";
            } else if (selectValue === "Sim") {
                enderecoInput.disabled = false;
                enderecoInput.value = "";
            }
        });
    }

    // Desabilita o campo de parcelas caso a opção de pagamento seja diferente de "Cartão de crédito"
    const paymentSelect = document.getElementById("paymentSelect");
    if (paymentSelect) {
        paymentSelect.addEventListener("change", function () {
            const selectValue = this.value;
            const parcelasInput = document.getElementById("parcelasAmount");
            const valorTotal = document.getElementById("valorTotal");
            const vehicleSelector = document.getElementById("vehicle-selector");

            let price = parseFloat(vehicleSelector.options[vehicleSelector.selectedIndex].getAttribute("data-price")) || 0;

            if (selectValue === "cartão de crédito") {
                parcelasInput.disabled = false;
                parcelasInput.selectedIndex = -1;
                valorTotal.value = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            } else {
                parcelasInput.disabled = true;
                parcelasInput.selectedIndex = 0;
                ParcelasPriceInput.value = "R$ 0,00";

                // Aplicar desconto de 5% para dinheiro ou Pix
                if (selectValue === "dinheiro" || selectValue === "pix") {
                    price *= 0.95; // Aplica o desconto de 5%
                    valorTotal.value = `${price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (5% de desconto aplicado!)`;
                } else {
                    valorTotal.value = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                }
            }
        });
    }

    // Mostra o valor original do veículo e já calcula o valor final com as parcelas
    const vehicleSelector = document.getElementById("vehicle-selector");
    const originalPriceInput = document.getElementById("OriginalPrice");

    // Atualizar o valor original ao selecionar um veículo
    if (vehicleSelector && originalPriceInput) {
        vehicleSelector.addEventListener("change", function () {
            const selectedOption = vehicleSelector.options[vehicleSelector.selectedIndex];
            let price = parseFloat(selectedOption.getAttribute("data-price")) || 0;

            // Formatar e exibir o valor
            originalPriceInput.value = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

            // Se o pagamento for dinheiro ou Pix, aplicar desconto automaticamente
            if (paymentSelect.value === "dinheiro" || paymentSelect.value === "pix") {
                let discountedPrice = price * 0.95;
                valorTotal.value = `${discountedPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (5% de desconto aplicado!)`;
            } else {
                valorTotal.value = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            }
        });
    }

    // Atualizar o valor final ao selecionar o número de parcelas
    const parcelasInput = document.getElementById("parcelasAmount");
    const ParcelasPriceInput = document.getElementById("ParcelasPrice");
    const valorTotal = document.getElementById("valorTotal");

    if (parcelasInput && ParcelasPriceInput && originalPriceInput && valorTotal) {
        parcelasInput.addEventListener("change", function () {
            const selectedOption = parcelasInput.options[parcelasInput.selectedIndex];
            const parcelas = parseInt(selectedOption.value) || 1;

            let price = parseFloat(originalPriceInput.value.replace(/\D/g, "")) / 100;
            let interestRate = 0;

            // Definir taxas de juros com base no número de parcelas
            switch (parcelas) {
                case 1:
                    interestRate = 0.01;
                    break;
                case 24:
                    interestRate = 0.015;
                    break;
                case 36:
                    interestRate = 0.0175;
                    break;
                case 48:
                    interestRate = 0.02;
                    break;
                case 60:
                    interestRate = 0.0225;
                    break;
                case 72:
                    interestRate = 0.025;
                    break;
                default:
                    interestRate = 0;
            }

            let totalPrice, parcelaPrice;

            if (interestRate === 0) {
                // Pagamento à vista
                totalPrice = price;
                parcelaPrice = price;
            } else {
                // Cálculo pelo sistema PRICE (tabela price)
                const i = interestRate;
                const n = parcelas;

                parcelaPrice = (price * i) / (1 - Math.pow(1 + i, -n)); // Fórmula da Tabela Price
                totalPrice = parcelaPrice * parcelas;
            }

            // Formatar e exibir os valores
            ParcelasPriceInput.value = parcelaPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            valorTotal.value = totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        });
    }

    // Código para formatação de preços e quilômetros em pt-BR
    const kmElements = document.getElementsByClassName("km");
    const priceElements = document.getElementsByClassName("price");

    for (let kmElement of kmElements) {
        let kmValue = parseFloat(kmElement.textContent.replace(/\D/g, ""));
        if (!isNaN(kmValue)) {
            kmElement.textContent = kmValue.toLocaleString("pt-BR") + " km";
        }
    }

    for (let priceElement of priceElements) {
        let priceValue = parseFloat(priceElement.textContent.replace(/\D/g, ""));
        if (!isNaN(priceValue)) {
            priceElement.textContent = priceValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    }

    // Formulario de delete de veículos
    const deleteVehicleForms = document.querySelectorAll("form.delete-form");
    if (deleteVehicleForms.length > 0) {
        deleteVehicleForms.forEach((form) => {
            form.addEventListener("submit", function (event) {
                const confirmDelete = confirm("Tem certeza que deseja excluir este veículo?");
                if (!confirmDelete) {
                    // Cancela a exclusão se o usuário cancelar
                    event.preventDefault();
                }
            });
        });
    }

    // Formulario de delete de cliente
    const deleteCustomersForms = document.querySelectorAll("form.delete-Customers-form");
    if (deleteCustomersForms.length > 0) {
        deleteCustomersForms.forEach((form) => {
            form.addEventListener("submit", function (event) {
                const confirmDelete = confirm("Tem certeza que deseja excluir este cliente?");
                if (!confirmDelete) {
                    // Cancela a exclusão se o usuário cancelar
                    event.preventDefault();
                }
            });
        });
    }

    // Confirmação de venda
    const confirmSaleForms = document.getElementById("vehicle-selector");
    const hiddenInput = document.getElementById("selectedVehicleId");
    if (confirmSaleForms && hiddenInput) {
        confirmSaleForms.addEventListener("change", function () {
            // Pegando o ID do veículo selecionado
            const selectedVehicle = this.value;
            // Atualizando o campo oculto com o ID do veículo
            hiddenInput.value = selectedVehicle;
            console.log("Veículo selecionado: ", selectedVehicle);

        });
    }

    // Mostra label quando foto for adicionada na settings
    const fileInput = document.getElementById('profilePhoto');
    const previewImage = document.getElementById('preview');
    const labelFotoNova = document.getElementById('labelFotoNova');

    if (fileInput && previewImage && labelFotoNova) {

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    labelFotoNova.style.display = 'inline';
                };

                reader.readAsDataURL(file);
            } else {
                previewImage.style.display = 'none';
                labelFotoNova.style.display = 'none';
            }
        });

    }

    // log para verificar se o script foi carregado
    console.log("Event_handlers.js carregado com sucesso!");
});