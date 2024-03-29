<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Infrastructure\Doctrine\DataTypes;

use Neos\Flow\Tests\UnitTestCase;
use Sitegeist\InspectorGadget\Infrastructure\Doctrine\DataTypes\JsonArrayType;
use Sitegeist\InspectorGadget\Tests\Fixtures\ArrayBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\BooleanBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\FloatBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\IntegerBasedValueObject;
use Sitegeist\InspectorGadget\Tests\Fixtures\StringBasedValueObject;

final class JsonArrayTypeTest extends UnitTestCase
{
    /**
     * @test
     * @return void
     */
    public function convertsValueObjectsToSerializableArrayStructures(): void
    {
        $this->assertEquals(
            [
                '__value_object_type' => ArrayBasedValueObject::class,
                '__value_object_value' => [
                    'key' => 'value'
                ]
            ],
            JsonArrayType::serializeValueObject(
                ArrayBasedValueObject::fromArray([
                    'key' => 'value'
                ])
            )
        );

        $this->assertEquals(
            [
                '__value_object_type' => StringBasedValueObject::class,
                '__value_object_value' => 'Hello World'
            ],
            JsonArrayType::serializeValueObject(
                StringBasedValueObject::fromString('Hello World')
            )
        );

        $this->assertEquals(
            [
                '__value_object_type' => BooleanBasedValueObject::class,
                '__value_object_value' => true
            ],
            JsonArrayType::serializeValueObject(
                BooleanBasedValueObject::fromBool(true)
            )
        );

        $this->assertEquals(
            [
                '__value_object_type' => IntegerBasedValueObject::class,
                '__value_object_value' => 12
            ],
            JsonArrayType::serializeValueObject(
                IntegerBasedValueObject::fromInt(12)
            )
        );

        $this->assertEquals(
            [
                '__value_object_type' => FloatBasedValueObject::class,
                '__value_object_value' => 55.55
            ],
            JsonArrayType::serializeValueObject(
                FloatBasedValueObject::fromFloat(55.55)
            )
        );

        $this->assertEquals(
            [
                '__value_object_type' => ArrayBasedValueObject::class,
                '__value_object_value' => [
                    'array' => [
                        'key' => 'value'
                    ],
                    'string' => 'string value',
                    'boolean' => false,
                    'integer' => 23,
                    'float' => 22.22
                ]
            ],
            JsonArrayType::serializeValueObject(
                ArrayBasedValueObject::fromArray([
                    'array' => ArrayBasedValueObject::fromArray([
                        'key' => 'value'
                    ]),
                    'boolean' => BooleanBasedValueObject::fromBool(false),
                    'string' => StringBasedValueObject::fromString('string value'),
                    'integer' => IntegerBasedValueObject::fromInt(23),
                    'float' => FloatBasedValueObject::fromFloat(22.22)
                ])
            )
        );
    }

    /**
     * @test
     * @return void
     */
    public function deserializesValueObjectsFromSerializableArrayStructures(): void
    {
        //
        // Array
        //
        $valueObject = JsonArrayType::deserializeValueObject([
            '__value_object_type' => ArrayBasedValueObject::class,
            '__value_object_value' => [
                'key' => 'value'
            ]
        ]);

        $this->assertInstanceOf(ArrayBasedValueObject::class, $valueObject);
        /** @var ArrayBasedValueObject $valueObject */
        $this->assertEquals(['key' => 'value'], $valueObject->getValue());

        //
        // String
        //
        $valueObject = JsonArrayType::deserializeValueObject([
            '__value_object_type' => StringBasedValueObject::class,
            '__value_object_value' => 'Hello World!'
        ]);

        $this->assertInstanceOf(StringBasedValueObject::class, $valueObject);
        /** @var StringBasedValueObject $valueObject */
        $this->assertEquals('Hello World!', $valueObject->getValue());

        //
        // Boolean
        //
        $valueObject = JsonArrayType::deserializeValueObject([
            '__value_object_type' => BooleanBasedValueObject::class,
            '__value_object_value' => false
        ]);

        $this->assertInstanceOf(BooleanBasedValueObject::class, $valueObject);
        /** @var BooleanBasedValueObject $valueObject */
        $this->assertEquals(false, $valueObject->getValue());

        //
        // Integer
        //
        $valueObject = JsonArrayType::deserializeValueObject([
            '__value_object_type' => IntegerBasedValueObject::class,
            '__value_object_value' => 87
        ]);

        $this->assertInstanceOf(IntegerBasedValueObject::class, $valueObject);
        /** @var IntegerBasedValueObject $valueObject */
        $this->assertEquals(87, $valueObject->getValue());

        //
        // Float
        //
        $valueObject = JsonArrayType::deserializeValueObject([
            '__value_object_type' => FloatBasedValueObject::class,
            '__value_object_value' => 17.777
        ]);

        $this->assertInstanceOf(FloatBasedValueObject::class, $valueObject);
        /** @var FloatBasedValueObject $valueObject */
        $this->assertEquals(17.777, $valueObject->getValue());
    }
}
