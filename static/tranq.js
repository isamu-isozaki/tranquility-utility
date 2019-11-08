var mem=[];
mem.length = 65536;
var sp;
var fp;
var hwin;
var imgnum, butnum, labnum;
var edata;


function push(x) {
	mem[sp] = x;
	sp--;
}

function pop(x) {
	sp++;
	return mem[sp];
}

function a2s(x) {
	s = "";
	while(mem[x] != 0) {
		s += String.fromCharCode(mem[x]);
		x++;
	}
	return s;
}


function leval(l) {
	pc = 0;
	while(pc >= 0) {
		pc = eval(l, pc);
	}
	return pc;
}

function call(n) {
	if(n <= -13 && n >= -18 && hwin == null) {
		hwin = window.open();
	}
	switch(n) {
	case -1:	/* iprint */
		x = pop();
		stdout.value += x;
		push(0);
		break;
	case -2:	/* sprint */
		x = pop();
		s = a2s(x);
		stdout.value += s;
		push(0);
		break;
	case -3:	/* iread */
		x = window.prompt("Integer input:");
		push(parseInt(x, 10));
		break;
	case -4:	/* sread */
		a = pop();
		x = window.prompt("String input:");
		for(i = 0; i < x.length; i++)
			mem[a+i] = x.charCodeAt(i);
		mem[a+i] = 0;
		push(0);
		break;
	case -5:	/* nl */
		stdout.value += "\n";
		push(0);
		break;
	case -10:	/* random */
		n = pop();
		n = Math.floor(Math.random() * n);
		push(n);
		break;
	case -11:	/* timer */
		var f;
		to = pop();
		f = pop();
		n = setTimeout(function(){call(f)}, to);
		push(n);
		break;
	case -12:	/* stoptimer */
		n = pop();
		clearTimeout(n);
		push(0);
		break;
	case -13:	/* makeimg */
		$(document.body).append('<img id=img' + imgnum + ' />\n');
		push(imgnum);
		imgnum++;
		break;
	case -14:	/* setimg */
		n = pop();
		src = pop();
		s = a2s(src);
		i = hwin.document.getElementById('img'+n);
		i.src = s;
		push(0);
		break;
	case -15:	/* button */
		butname = pop();
		n = pop();
		s = a2s(butname);
		t1 = '<button id=but' + butnum + ' onclick="window.opener.call(' + n + ');">';
		hwin.document.write(t1 + s + '</button>\n');
		push(butnum);
		butnum++;
		break;
	case -16:	/* html */
		x = pop();
		s = a2s(x);
		$(document.body).append(s);
		push(0);
		break;
	case -17: /* makelabel */
		labtxt = pop();
		s = a2s(labtxt);
		$(document.body).append('<label id=lab' + labnum + '>' + s + '</label>\n');
		push(labnum);
		labnum++;
		break;
	case -18:	/* setlabel */
		n = pop();
		label = pop();
		s = a2s(label);
		l = hwin.document.getElementById('lab'+n);
		l.innerHTML = s;
		push(0);
		break;
	case -19:	/* alloc */
		n = pop();
		push(edata);
		edata += n;
		break;
	case -20:	/* free */
		a = pop();
		push(0);
		break;
	case -21:	/* i2s */
		s = pop();
		n = pop();
		istr = n.toString(10);
		for(i = 0; i < istr.length; i++)
			mem[s + i] = istr.charCodeAt(i);
		mem[s+i] = 0;
		push(0);
		break;
	default:
		if(n < 0) {
			console.log("Invalid function call", n);
			return;
		}
		for(i = 0; i < m[n+2][3]; i++)
			push(0);
		mem[sp] = fp;
		fp = sp;
		sp--;
		leval(m[n+2][4]);
		r = pop();
		sp = fp;
		fp = mem[sp];
		sp += m[n+2][2] + m[n+2][3];
		push(r);
		break;
	}
}

function eval(l, pc) {
	if(pc >= l.length) {
		return -1;
	}
	ir = l[pc];
	pc++;
	switch(ir) {
	case 1:	/* push */
		push(l[pc]);
		pc++;
		break;
	case 2:	/* fetch */
		a = pop();
		push(mem[a]);
		break;
	case 3:	/* store */
		v = pop();
		a = pop();
		mem[a] = v;
		break
	case 4:	/* if */
		x = pop();
		if(x != 0) {
			r = leval(l[pc]);
			pc += 2;
		}
		else {
			pc++;
			r = leval(l[pc]);
			pc++;
		}
		if(r <= -2)
			return r;
		break
	case 5:	/* loop */
		while(1) {
			r = leval(l[pc]);
			if(r == -2)
				break;
			else if(r == -3)
				return -3;
		}
		pc++;
		break;
	case 6:	/* break */
		x = pop();
		if(x != 0)
			return -2;
		break;
	case 7:	/* return */
		return -3;
	case 8:	/* call */
		call(l[pc]);
		pc++;
		break;
	case 9:	/* fpplus */
		a = pop();
		a += fp;
		push(a);
		break;
	case 10:	/* add */
		y = pop();
		x = pop();
		push(x+y);
		break;
	case 11:	/* sub */
		y = pop();
		x = pop();
		push(x-y);
		break;
	case 12:	/* mul */
		y = pop();
		x = pop();
		push(x*y);
		break;
	case 13:	/* div */
		y = pop();
		x = pop();
		push(Math.floor(x/y));
		break;
	case 14:	/* mod */
		y = pop();
		x = pop();
		push(x%y);
		break;
	case 15:	/* not */
		x = pop();
		push(~x);
		break
	case 16:	/* and */
		y = pop();
		x = pop();
		push(x&y);
		break
	case 17:	/* or */
		y = pop();
		x = pop();
		push(x|y);
		break
	case 18:	/* xor */
		y = pop();
		x = pop();
		push(x^y);
		break
	case 19:	/* eq */
		y = pop();
		x = pop();
		if(x == y)
			push(1);
		else
			push(0);
		break
	case 20:	/* neq */
		y = pop();
		x = pop();
		if(x != y)
			push(1);
		else
			push(0);
		break;
	case 21:	/* lt */
		y = pop();
		x = pop();
		if(x < y)
			push(1);
		else
			push(0);
		break
	case 22:	/* leq */
		y = pop();
		x = pop();
		if(x <= y)
			push(1);
		else
			push(0);
		break
	case 23:	/* gt */
		y = pop();
		x = pop();
		if(x > y)
			push(1);
		else
			push(0);
		break;
	case 24:	/* geq */
		y = pop();
		x = pop();
		if(x >= y)
			push(1);
		else
			push(0);
		break;
	case 25:	/* pop */
		pop();
		break;
	case 26:	/* lshift */
		s = pop();
		x = pop();
		push(x << s);
		break;
	case 27:	/* rshift */
		s = pop();
		x = pop();
		push(x >> s);
		break;
	default:
		console.log("unknown opcode ", ir);
		break;
	}
	return pc;
}

function start() {
	edata = m[0][1];
	call(m[0][0]);
	console.log("halt");
}

function startvm() {
	hwin = null;
	imgnum = 0;
	butnum = 0;
	labnum = 0;
	m = JSON.parse(tape);
	sp = 65535;
	fp = 65535;
	for(n = 0; n < m[1].length; n++) {
		mem[m[1][n][0]] = m[1][n][1];
	}
}