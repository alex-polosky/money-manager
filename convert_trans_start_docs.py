a = '''\
list of things'''
b = a.split('\n')
c = [x.split('\t') for x in b]

for x in c:
    if not x or not x[0]:
        continue
    print('''\
                        {{
                            "name": "{name}",
                            "value": {value},
                            "paidFrom": {paidFrom},
                            "day": {day},
                            "isPaid": {isPaid},
                            "auto": {auto},
                            "comment": "{comment}"
                        }},'''.format(
    name = x[0],
    value = 0 - float((x[1] if x[1] else x[2]).split()[1].replace('-', '(0)').replace(',', '')[1:-1]), # problem if the value actually _is_ positive, but I'm pretty sure that isn't a thing soooo :shrug:
    day = x[3] or 'null',
    paidFrom = '"{0}"'.format(x[4]) if x[4] and x[4].lower() != 'paid' and not x[4].lower().startswith('with') and not x[4].lower().startswith('auto') else 'null',
    isPaid = 'true' if x[4] != '' else 'false',
    auto = 'true' if x[4].lower().startswith('auto') or x[4].lower().startswith('with') else 'false',
    comment = x[4]
    )
)