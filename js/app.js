/* ================= ДА / НЕТ ================= */
(function () {
  var ORB = document.getElementById('orb');
  var FACE = document.getElementById('orbFace');
  var PANEL = document.getElementById('answerPanel');
  var AQ = document.getElementById('answerQuestion');
  var AT = document.getElementById('answerText');
  var QUESTION = document.getElementById('question');
  var ASK_BTN = document.getElementById('askBtn');

  var ALT = [
    ['Да', 'Да'], ['Нет', 'Нет'],
    ['Да.', 'Да'], ['Нет.', 'Нет'],
    ['Точно да', 'Да'], ['Точно нет', 'Нет']
  ];

  function ask() {
    var q = QUESTION.value.trim();
    var pick = ALT[Math.floor(Math.random() * ALT.length)];
    var answer = pick[0];
    var cls = pick[1] === 'Да' ? 'yes' : 'no';

    if (q) {
      AQ.textContent = '«' + q + '»';
    } else {
      AQ.textContent = 'Без вопроса — просто игра случая.';
    }

    ORB.classList.remove('shaking', 'revealing');
    FACE.textContent = '?';
    PANEL.hidden = true;

    void ORB.offsetWidth; /* перезапуск анимации */
    ORB.classList.add('shaking');

    setTimeout(function () {
      FACE.textContent = answer;
      AT.textContent = answer;
      PANEL.hidden = false;
      ORB.classList.add('revealing');
    }, 620);
  }

  ASK_BTN.addEventListener('click', ask);
  QUESTION.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') ask();
  });
})();

/* ================= ПСИХОМАТРИЦА ПИФАГОРА ================= */
(function () {
  var DATE_IN = document.getElementById('birthdate');
  var CALC_BTN = document.getElementById('calcBtn');
  var ERR = document.getElementById('matrixErr');
  var RESULT = document.getElementById('matrixResult');

  var CELL_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  var CELL_MEAN = {
    1: { name: 'Характер, воля',
      d: ['Характера почти нет — ты ведомый и мягкий. Учись говорить «нет».',
          'Характер есть, но эгоцентризм умеренный. Умеешь настоять на своём, когда важно.',
          'Эгоист по жизни: свои интересы почти всегда первее. Главное — замечать других.',
          'Характер скачет: от решительности к уступчивости. Тебе нужны чёткие цели.',
          'Железная воля. Плюс — достигаешь целей. Минус — диктаторство, учись смягчаться.'] },
    2: { name: 'Энергетика',
      d: ['Энергии мало, быстро устаёшь. Береги ресурс: высыпайся, бери паузы.',
          'Запаса хватает на день, но не на подвиги. Трать энергию точечно.',
          'Золотая середина: энергии в норме — хватает на дело и на отдых.',
          'Энергии с запасом. Ты заряжаешь окружающих, но следи за перегрузом.',
          'Мощный источник. Без отдыха большая энергия выжигает изнутри.'] },
    3: { name: 'Познание, наука',
      d: ['Точная наука — не твой конёк. Зато ты усидчив и хваток на практике.',
          'Интерес к наукам есть, но лень и суета перебивают. Стабильность делает чудеса.',
          'Склонность к точным знаниям: из тебя может выйти хороший аналитик.',
          'Исследователь от природы: любишь докопаться до сути. Не останавливайся.',
          'Феноменальный ум к знаниям. Судьба ведёт в науку и сложные системы.'] },
    4: { name: 'Здоровье, тело',
      d: ['Здоровье слабое от природы. Укрепляй: режим, спорт, сон.',
          'Здоровье среднее, но внимание к себе всё решает. Двигайся больше.',
          'Организм крепкий и выносливый. Главное — не испытывать его годами.',
          'Очень крепкое здоровье и хорошая наследственность.',
          'Богатырское здоровье. Только такие чаще всего и гробят его привычками.'] },
    5: { name: 'Логика, интуиция',
      d: ['Интуиция шепчет, разум спорит. Доверяй первому ощущению — оно верное.',
          'Логика прокачивается с опытом. Планируй и анализируй — это твой рост.',
          'Интуиция плюс логика: чувствуешь людей и ситуации на шаг вперёд.',
          'Аналитический ум: просчитываешь варианты и читаешь людей.',
          'Почти ясновидение. Твои предчувствия удивляют окружающих.'] },
    6: { name: 'Трудолюбие, мастерство',
      d: ['Руками-хлопотами не живёшь — результат берёшь умом. Ищи интеллектуальный труд.',
          'Лень ходит рядом, но за дело отвечает чувство долга. Держи мотивацию.',
          'Работяга без фанатизма: пашет ровно, результат стабильный.',
          'Трудоголик. Работа — твоё топливо. Защищай личное время.',
          'Одержим трудом, мастер своего дела. Но без отдыха сгораешь.'] },
    7: { name: 'Удача, везение',
      d: ['Фарт не падает с неба — ты сам делаешь везение трудом и опытом.',
          'Курочка по зёрнышку: везёт ровно настолько, насколько вложился.',
          'Везение вшито в характер: шансы и попутный ветер — это про тебя.',
          'Счастливчик: вытягиваешь билеты, которые другим не достаются.',
          'Феноменальное везение. Но удача любит смелых — знай свой час.'] },
    8: { name: 'Долг, терпимость',
      d: ['Обязательства тяготят. Свобода важнее чужих ожиданий.',
          'Ответственный, но мягкий: неудобно отказывать. Учись говорить «стоп».',
          'Порядочный, держишь слово. Справедливость для тебя важна.',
          'Гиперответственность: тащишь чужие проблемы как свои. Разгружайся.',
          'Человек-долг: не можешь не выручить. Следи, чтобы добротой не пользовались.'] },
    9: { name: 'Память, ум',
      d: ['Запоминается главное, мелочи ускользают. Заводи заметки.',
          'Память живая, особенно на то, что интересно.',
          'Хорошая память: имена, даты, цифры — легко.',
          'Отличная память и широкий кругозор. Учишься быстро.',
          'Феноменальная память. Всю жизнь донашиваешь багаж впечатлений.'] }
  };

  var LINES = [
    { key: '1-2-3', type: 'row', name: 'Целеустремлённость', text: 'Способность ставить большую цель и идти к ней вопреки всему.' },
    { key: '4-5-6', type: 'row', name: 'Семьянин', text: 'Тяга к дому, семье, стабильному быту и близким.' },
    { key: '7-8-9', type: 'row', name: 'Стабильность', text: 'Привычки, порядок, потребность в привычном.' },
    { key: '1-4-7', type: 'col', name: 'Самооценка', text: 'Насколько веришь в себя и своё право на место в мире.' },
    { key: '2-5-8', type: 'col', name: 'Обеспечение', text: 'Работоспособность и умение кормить и защищать близких.' },
    { key: '3-6-9', type: 'col', name: 'Талант', text: 'Яркость, способности, склонность к творчеству.' },
    { key: '3-5-7', type: 'diag', name: 'Духовность', text: 'Стремление к смыслу, вере, глубокой связи.' },
    { key: '1-5-9', type: 'diag', name: 'Темперамент', text: 'Сила тела, страсть, любовь и желания.' }
  ];

  var NUM_MEAN = [
    'Задачи жизни — тест, который судьба ставит перед тобой в первую очередь.',
    'Ведущая врождённая черта — твоя базовая личность.',
    'Качество, которое нужно развивать — кармический урок.',
    'Главная цель — к чему ведёт твой путь по матрице.'
  ];

  function digitSum(n) {
    /* классика: сумма цифр, без дальнейшего сведения (29 -> 11, не 2) */
    return String(Math.abs(n)).split('').reduce(function (s, c) { return s + +c; }, 0);
  }

  function calc(dateStr) {
    var parts = dateStr.split('-'); /* yyyy-mm-dd */
    var y = parts[0], m = parts[1], d = parts[2];

    var dateDigits = (d + m + y).split('').map(Number).filter(function (n) { return n !== 0; });
    var w1 = dateDigits.reduce(function (s, n) { return s + n; }, 0);
    var w2 = digitSum(w1);
    /* первая цифра дня КАК НАПИСАНО (для "06" это 0) */
    var w3 = Math.abs(w1 - 2 * Number(d.charAt(0)));
    var w4 = digitSum(w3);

    var work = [w1, w2, w3, w4];
    /* в квадрат попадают цифры даты И цифры каждого рабочего числа */
    var all = dateDigits.slice();
    work.forEach(function (w) {
      String(w).split('').forEach(function (c) {
        var n = Number(c);
        if (n >= 1 && n <= 9) all.push(n);
      });
    });

    var counts = {}; /* 1..9 */
    for (var i = 1; i <= 9; i++) counts[i] = 0;
    all.forEach(function (n) {
      if (n >= 1 && n <= 9) counts[n]++;
    });

    return { work: work, counts: counts, dateStr: dateStr };
  }

  function keyLabel(n) { return n; }
  function keyIdx(n) { return n; }

  function render(result) {
    /* рабочие числа */
    var wn = document.getElementById('workNums');
    wn.innerHTML = '';
    result.work.forEach(function (v, i) {
      var el = document.createElement('div');
      el.className = 'worknum';
      var b = document.createElement('b');
      b.textContent = v;
      var s = document.createElement('span');
      s.textContent = (i + 1) + '-е рабочее число · ' + ['задачи жизни', 'лидерство', 'урок', 'цель'][i];
      el.appendChild(b); el.appendChild(s);
      wn.appendChild(el);
    });

    /* квадрат */
    var sq = document.getElementById('square');
    sq.innerHTML = '';
    for (var k = 1; k <= 9; k++) {
      var c = result.counts[k];
      var cell = document.createElement('div');
      cell.className = 'cell' + (c === 0 ? ' empty' : '');
      var val = document.createElement('div');
      if (c === 0) {
        val.textContent = '×';
      } else {
        val.textContent = new Array(c + 1).join(String(k)).slice(0, 6);
      }
      var cnt = document.createElement('div');
      cnt.className = 'cell-count';
      cnt.textContent = c === 0 ? 'нет' : '\u00d7' + c;
      cell.appendChild(val); cell.appendChild(cnt);
      sq.appendChild(cell);
    }

    /* пояснения по клеткам */
    var ce = document.getElementById('cellExpl');
    ce.innerHTML = '';
    for (var k2 = 1; k2 <= 9; k2++) {
      var c2 = result.counts[k2];
      var idx = Math.min(c2, 4);
      var card = document.createElement('div');
      card.className = 'cell-card';
      var h = document.createElement('h4');
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = String(k2);
      var title = document.createElement('span');
      title.textContent = CELL_MEAN[k2].name + ' · ' + c2;
      h.appendChild(badge); h.appendChild(title);
      var p = document.createElement('p');
      p.textContent = CELL_MEAN[k2].d[idx];
      card.appendChild(h); card.appendChild(p);
      ce.appendChild(card);
    }

    /* линии */
    var le = document.getElementById('lineExpl');
    le.innerHTML = '';
    LINES.forEach(function (line) {
      var cells = line.key.split('-').map(Number);
      var score = cells.filter(function (n) { return result.counts[n] > 0; }).length;
      var lv = score >= 3 ? ['strong', 'Сильная'] : (score === 2 ? ['mid', 'Средняя'] : ['weak', 'Слабая']);

      var card = document.createElement('div');
      card.className = 'line-card';
      var h = document.createElement('h4');
      var left = document.createElement('span');
      left.textContent = line.key + ' — ' + line.name;
      h.appendChild(left);
      var lvl = document.createElement('div');
      lvl.className = 'lv ' + lv[0];
      lvl.textContent = lv[1] + ' (' + score + '/3)';
      var p = document.createElement('p');
      p.textContent = line.text;
      var bar = document.createElement('div');
      bar.className = 'bar';
      var fill = document.createElement('i');
      fill.style.width = (score * 33.3) + '%';
      bar.appendChild(fill);
      card.appendChild(h); card.appendChild(lvl); card.appendChild(p); card.appendChild(bar);
      le.appendChild(card);
    });

    /* числа */
    var ne = document.getElementById('numExpl');
    ne.innerHTML = '';
    result.work.forEach(function (v, i) {
      var card = document.createElement('div');
      card.className = 'num-card';
      var h = document.createElement('h4');
      h.textContent = (i + 1) + '-е число — ' + v;
      var p = document.createElement('p');
      p.textContent = NUM_MEAN[i];
      card.appendChild(h); card.appendChild(p);
      ne.appendChild(card);
    });

    RESULT.hidden = false;
    RESULT.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function run() {
    var v = DATE_IN.value;
    ERR.hidden = true;

    if (!v) {
      ERR.textContent = 'Укажи дату рождения.';
      ERR.hidden = false;
      DATE_IN.classList.add('invalid');
      return;
    }
    DATE_IN.classList.remove('invalid');

    try {
      render(calc(v));
    } catch (e) {
      ERR.textContent = 'Не получилось рассчитать: введи дату в формате ДД.ММ.ГГГГ.';
      ERR.hidden = false;
    }
  }

  CALC_BTN.addEventListener('click', run);
  DATE_IN.addEventListener('change', function () { DATE_IN.classList.remove('invalid'); ERR.hidden = true; });

  /* демо-значение для первого знакомства */
  DATE_IN.value = '1996-03-15';
  run();
})();