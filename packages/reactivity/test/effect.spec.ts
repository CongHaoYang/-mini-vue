import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10,
        });
        let nextAge;
        // 1. 执行user.age会get一下，就会track了，然后就可以将 effect文件的this绑定到ReactiveEffect了
        effect(() => {
            nextAge = user.age + 1;
        });

        expect(nextAge).toBe(11);

        user.age++;

        expect(nextAge).toBe(12);
    })

    it("should return runner when called effect", () => {
        // expect(fn) -> funtion(runner) -> fn -> return

        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        })

        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    })

    it("scheduler", () => {
        let dummy;
        let run: any;
        const schedular = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({foo: 1});
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            schedular
        })
        expect(schedular).not.toHaveBeenCalled();
        expect(dummy).toBe(1);

        obj.foo++;
        expect(schedular).toHaveBeenCalledTimes(1);

        expect(dummy).toBe(1);

        run();
        expect(dummy).toBe(2);


    })

    it("stop", () => {
        let dumy;
        const obj = reactive({foo: 1});
        const runner = effect(() => {
            dumy = obj.foo;
        })
        expect(dumy).toBe(1);
        obj.foo = 2;
        expect(dumy).toBe(2);
        stop(runner);
        // obj.foo = 3;
        obj.foo++; // 触发get操作单测就会不通过
        expect(dumy).toBe(2);

        runner();
        expect(dumy).toBe(3);
    })

    it("onStop", () => {
        const obj = reactive({
            foo: 1
        });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(() => {
            dummy = obj.foo
        }, {
            onStop
        });

        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})