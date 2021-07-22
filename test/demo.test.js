function sun(a, b) {
   return a + b;
}

test("描述：10 + 20 应该等于 30", () => {
    const res = sun(10, 20);
    expect(res).toBe(30);
});

test("描述：10 + 20 不等于 40", () => {
    const res = sun(10, 20);
    expect(res).not.toBe(40);
});
