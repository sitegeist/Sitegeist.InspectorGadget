<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Infrastructure\TypeConverter;

use Neos\Flow\Tests\UnitTestCase;
use Sitegeist\InspectorGadget\Infrastructure\TypeConverter\DenormalizingObjectConverter;
use Sitegeist\InspectorGadget\Tests\Fixtures\ArrayBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\StringBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\BooleanBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\IntegerBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\FloatBasedValueObject;

final class DenormalizingObjectConverterTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function canConvertFromArray(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $this->assertTrue($typeConverter->canConvertFrom(['key' => 'value'], ArrayBasedValueObject::class));
    }

    /**
     * @test
     * @return void
     */
    public function convertsFromArray(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $result = $typeConverter->convertFrom(['key' => 'value'], ArrayBasedValueObject::class);

        $this->assertInstanceOf(ArrayBasedValueObject::class, $result);
        $this->assertEquals(['key' => 'value'], $result->getValue());
    }

    /**
     * @test
     * @return void
     */
    public function canConvertFromString(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $this->assertTrue($typeConverter->canConvertFrom('string', StringBasedValueObject::class));
    }

    /**
     * @test
     * @return void
     */
    public function convertsFromString(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $result = $typeConverter->convertFrom('string', StringBasedValueObject::class);

        $this->assertInstanceOf(StringBasedValueObject::class, $result);
        $this->assertEquals('string', $result->getValue());
    }

    /**
     * @test
     * @return void
     */
    public function canConvertFromBoolean(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $this->assertTrue($typeConverter->canConvertFrom(true, BooleanBasedValueObject::class));
    }

    /**
     * @test
     * @return void
     */
    public function convertsFromBoolean(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $resultFalse = $typeConverter->convertFrom(false, BooleanBasedValueObject::class);

        $this->assertInstanceOf(BooleanBasedValueObject::class, $resultFalse);
        $this->assertEquals(false, $resultFalse->getValue());

        $resultTrue = $typeConverter->convertFrom(true, BooleanBasedValueObject::class);

        $this->assertInstanceOf(BooleanBasedValueObject::class, $resultTrue);
        $this->assertEquals(true, $resultTrue->getValue());
    }

    /**
     * @test
     * @return void
     */
    public function canConvertFromInteger(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $this->assertTrue($typeConverter->canConvertFrom(42, IntegerBasedValueObject::class));
    }

    /**
     * @test
     * @return void
     */
    public function convertsFromInteger(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $result = $typeConverter->convertFrom(12264, IntegerBasedValueObject::class);

        $this->assertInstanceOf(IntegerBasedValueObject::class, $result);
        $this->assertEquals(12264, $result->getValue());
    }

    /**
     * @test
     * @return void
     */
    public function canConvertFromFloat(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $this->assertTrue($typeConverter->canConvertFrom(23.3, FloatBasedValueObject::class));
    }

    /**
     * @test
     * @return void
     */
    public function convertsFromFloat(): void
    {
        $typeConverter = new DenormalizingObjectConverter();
        $result = $typeConverter->convertFrom(12264.123, FloatBasedValueObject::class);

        $this->assertInstanceOf(FloatBasedValueObject::class, $result);
        $this->assertEquals(12264.123, $result->getValue());
    }
}