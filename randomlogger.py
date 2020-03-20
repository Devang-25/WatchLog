#!/usr/bin/python
import random, time

filename = "logfile"

def main():
    sentences = ['Lorem ipsum dolor sit amet consectetur, adipisicing elit.', 'Consectetur accusamus quo hic!', 'Necessitatibus fugiat eveniet repellat magni dolore sit ducimus?']
    while True:
        if random.randint(0,100) < 50:
            with open(filename, 'a') as logfile:
                s = "[" + time.asctime(time.localtime()) + "] "
                s += sentences[random.randint(0,2)]
                s += '\n'
                logfile.write(s)
        time.sleep(10)
if __name__ == "__main__":
    main()