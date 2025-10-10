function initializeCustomerNotification() {
    document.querySelectorAll('input[name="customernotification"]').forEach(radio => {
      radio.addEventListener('change', function() {
          console.log('Radio button changed to:', this.value);
            const messageArea = document.getElementById('customerMessageArea');
            messageArea.style.display = this.value === 'yes' ? 'block' : 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCustomerNotification();
});
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ncrForm');
  const steps = Array.from(form.querySelectorAll('fieldset.step'));
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const stepDots = Array.from(document.querySelectorAll('#progressSteps .step-dot'));

  let current = 0;
  showStep(0);

  steps.forEach((fs, index) => {
    const btnPrev = fs.querySelector('.btn-prev');
    const btnNext = fs.querySelector('.btn-next');
    const btnFinish = fs.querySelector('.btn-finish');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (index > 0) showStep(index - 1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (validateStep(index)) showStep(index + 1);
      });
    }
    if (btnFinish) {
      btnFinish.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateStep(index)) return;
        window.print();
      });
    }
  });

  stepDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i <= current) {
        showStep(i);
      } else {

        let ok = true;
        for (let s = current; s < i; s++) {
          ok = validateStep(s);
          if (!ok) break;
        }
        if (ok) showStep(i);
      }
    });
  });

  const customerRadios = form.querySelectorAll('input[name="customernotification"]');
  const customerArea = document.getElementById('customerMessageArea');
  if (customerRadios.length && customerArea) {
    customerRadios.forEach(r => {
      r.addEventListener('change', () => {
        const yes = form.querySelector('input[name="customernotification"]:checked')?.value === 'yes';
        customerArea.style.display = yes ? 'block' : 'none';
        const msg = document.getElementById('customerMessage');
        if (msg) msg.required = !!yes;
      });
    });
  }

  function showStep(i) {
    steps.forEach((fs, idx) => {
      fs.style.display = idx === i ? 'block' : 'none';
    });
    current = i;


    const prevBtn = steps[i].querySelector('.btn-prev');
    if (prevBtn) prevBtn.classList.toggle('hidden', i === 0);

    updateProgressUI();
    steps[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(index) {
    const fs = steps[index];
    const required = fs.querySelectorAll('input[required], select[required], textarea[required]');
    for (const el of required) {
      if (el.type === 'radio') {
        const group = fs.querySelectorAll(`input[type="radio"][name="${el.name}"]`);
        const anyChecked = Array.from(group).some(r => r.checked);
        if (!anyChecked) {
          // enfocar el primero y reportar
          group[0].focus();
          group[0].reportValidity();
          return false;
        }
      } else {
        if (!el.checkValidity()) {
          el.reportValidity();
          return false;
        }
      }
    }
    return true;
  }

  function updateProgressUI() {
    const total = steps.length;
    const pct = Math.round(((current + 1) / total) * 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `${pct}% (Step ${current + 1} de ${total})`;

    stepDots.forEach((dot, idx) => {
      dot.dataset.active = (idx === current).toString();
      dot.classList.toggle('opacity-100', idx <= current);
      dot.classList.toggle('opacity-50', idx > current);
    });
  }
});
