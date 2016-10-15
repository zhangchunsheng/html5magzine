<?php
require(__DIR__ . "/../src/Hello.php");

class HelloTest extends PHPUnit_Framework_TestCase {
    public function testSayHello() {
        $hello = new Hello();
        $data = $hello->sayHello("php");
        $this->assertEquals($data, "hello php");
    }
}
