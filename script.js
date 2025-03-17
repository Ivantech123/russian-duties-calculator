document.addEventListener('DOMContentLoaded', () => {
    const dutyTypeSelect = document.getElementById('duty-type');
    const calculationForm = document.getElementById('calculation-form');
    const resultAmount = document.getElementById('result-amount');

    // Актуальные ставки госпошлин на 2025 год
    const RATES = {
        court: {
            propertyRates: [
                { threshold: 20000, rate: 400, percent: 0 },
                { threshold: 100000, rate: 0, percent: 4 },
                { threshold: 200000, rate: 3000, percent: 3 },
                { threshold: Infinity, rate: 5000, percent: 2 }
            ],
            administrative: 2000,
            appeal: {
                first: 150,
                cassation: 300
            }
        },
        property: {
            ownership: 2000,
            share: 350,
            mortgage: 1000,
            extract: 400
        },
        marriage: {
            registration: 350,
            divorce: {
                mutual: 650,
                unilateral: 350
            },
            certificate: 200
        },
        passport: {
            adult: {
                normal: 5000,
                urgent: 10000
            },
            child: {
                normal: 2500,
                urgent: 5000
            }
        },
        business: {
            ip: 800,
            ooo: 4000,
            changes: 800,
            liquidation: 1000
        }
    };

    const dutyForms = {
        court: `
            <div class="form-group">
                <label for="claim-amount">Сумма иска (₽):</label>
                <input type="number" id="claim-amount" min="0" step="1000">
            </div>
            <div class="form-group">
                <label for="case-type">Тип дела:</label>
                <select id="case-type">
                    <option value="property">Имущественный спор</option>
                    <option value="administrative">Административное дело</option>
                    <option value="appeal-first">Апелляционная жалоба</option>
                    <option value="appeal-cassation">Кассационная жалоба</option>
                </select>
            </div>
        `,
        property: `
            <div class="form-group">
                <label for="property-value">Стоимость недвижимости (₽):</label>
                <input type="number" id="property-value" min="0" step="1000">
            </div>
            <div class="form-group">
                <label for="registration-type">Тип регистрации:</label>
                <select id="registration-type">
                    <option value="ownership">Право собственности</option>
                    <option value="share">Долевое участие</option>
                    <option value="mortgage">Ипотека</option>
                    <option value="extract">Выписка из ЕГРН</option>
                </select>
            </div>
        `,
        marriage: `
            <div class="form-group">
                <label for="marriage-type">Тип услуги:</label>
                <select id="marriage-type">
                    <option value="registration">Регистрация брака</option>
                    <option value="divorce-mutual">Расторжение брака (по обоюдному согласию)</option>
                    <option value="divorce-unilateral">Расторжение брака (в одностороннем порядке)</option>
                    <option value="certificate">Повторное свидетельство</option>
                </select>
            </div>
        `,
        passport: `
            <div class="form-group">
                <label for="passport-type">Тип паспорта:</label>
                <select id="passport-type">
                    <option value="adult">Взрослый (старше 14 лет)</option>
                    <option value="child">Детский (до 14 лет)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="passport-urgent">Срочное оформление:</label>
                <select id="passport-urgent">
                    <option value="no">Нет</option>
                    <option value="yes">Да</option>
                </select>
            </div>
        `,
        business: `
            <div class="form-group">
                <label for="business-type">Тип регистрации:</label>
                <select id="business-type">
                    <option value="ip">Регистрация ИП</option>
                    <option value="ooo">Регистрация ООО</option>
                    <option value="changes">Внесение изменений</option>
                    <option value="liquidation">Ликвидация</option>
                </select>
            </div>
        `
    };

    const calculateDuty = () => {
        const dutyType = dutyTypeSelect.value;
        let amount = 0;

        switch (dutyType) {
            case 'court':
                const claimAmount = parseFloat(document.getElementById('claim-amount')?.value || 0);
                const caseType = document.getElementById('case-type')?.value;
                
                if (caseType === 'property') {
                    // Находим подходящую ставку
                    let rate = RATES.court.propertyRates[0];
                    for (const r of RATES.court.propertyRates) {
                        if (claimAmount <= r.threshold) {
                            rate = r;
                            break;
                        }
                    }
                    
                    // Рассчитываем сумму пошлины
                    if (rate.percent > 0) {
                        amount = rate.rate + (claimAmount * rate.percent / 100);
                    } else {
                        amount = rate.rate;
                    }
                } else if (caseType === 'administrative') {
                    amount = RATES.court.administrative;
                } else if (caseType === 'appeal-first') {
                    amount = RATES.court.appeal.first;
                } else if (caseType === 'appeal-cassation') {
                    amount = RATES.court.appeal.cassation;
                }
                break;

            case 'property':
                const regType = document.getElementById('registration-type')?.value;
                amount = RATES.property[regType];
                break;

            case 'marriage':
                const marriageType = document.getElementById('marriage-type')?.value;
                
                if (marriageType === 'registration') {
                    amount = RATES.marriage.registration;
                } else if (marriageType === 'divorce-mutual') {
                    amount = RATES.marriage.divorce.mutual;
                } else if (marriageType === 'divorce-unilateral') {
                    amount = RATES.marriage.divorce.unilateral;
                } else if (marriageType === 'certificate') {
                    amount = RATES.marriage.certificate;
                }
                break;

            case 'passport':
                const passportType = document.getElementById('passport-type')?.value;
                const isUrgent = document.getElementById('passport-urgent')?.value === 'yes';
                
                if (passportType === 'adult') {
                    amount = isUrgent ? RATES.passport.adult.urgent : RATES.passport.adult.normal;
                } else {
                    amount = isUrgent ? RATES.passport.child.urgent : RATES.passport.child.normal;
                }
                break;

            case 'business':
                const businessType = document.getElementById('business-type')?.value;
                amount = RATES.business[businessType];
                break;
        }

        resultAmount.textContent = amount.toLocaleString('ru-RU') + ' ₽';
    };

    dutyTypeSelect.addEventListener('change', () => {
        calculationForm.innerHTML = dutyForms[dutyTypeSelect.value];
        const inputs = calculationForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                // При изменении полей только проверяем валидность
                const claimAmount = document.getElementById('claim-amount');
                if (claimAmount) {
                    claimAmount.classList.toggle('invalid', claimAmount.value < 0);
                }
            });
        });
    });

    // Добавляем обработчик для кнопки расчета
    document.getElementById('calculate-button').addEventListener('click', calculateDuty);

    // Initialize with the first form
    dutyTypeSelect.dispatchEvent(new Event('change'));
});
