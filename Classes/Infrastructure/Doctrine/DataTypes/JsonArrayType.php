<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Infrastructure\Doctrine\DataTypes;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\Doctrine\DataTypes\JsonArrayType as FlowJsonArrayType;
use Sitegeist\InspectorGadget\Infrastructure\TypeConverter\DenormalizingObjectConverter;

/**
 * @Flow\Proxy(false)
 */
final class JsonArrayType extends FlowJsonArrayType
{
    /**
     * @param array<mixed> $array
     * @return void
     */
    protected function decodeObjectReferences(array &$array)
    {
        foreach ($array as &$value) {
            if (is_array($value) && isset($value['__value_object_value']) && isset($value['__value_object_type'])) {
                $value = self::deserializeValueObject($value);
            }
        }

        parent::decodeObjectReferences($array);
    }

    /**
     * @param array<mixed> $array
     * @return void
     * @throws \RuntimeException
     */
    protected function encodeObjectReferences(array &$array)
    {
        foreach ($array as &$value) {
            if ($value instanceof \JsonSerializable && DenormalizingObjectConverter::isDenormalizable(get_class($value))) {
                $value = self::serializeValueObject($value);
            }
        }

        parent::encodeObjectReferences($array);
    }

    /**
     * @param \JsonSerializable $valueObject
     * @return array<mixed>
     * @throws \RuntimeException
     */
    public static function serializeValueObject(\JsonSerializable $valueObject): array
    {
        if ($json = json_encode($valueObject)) {
            return [
                '__value_object_type' => get_class($valueObject),
                '__value_object_value' =>
                    json_decode($json, true)
            ];
        }

        throw new \RuntimeException(
            sprintf(
                'Could not serialize $valueObject due to: %s',
                json_last_error_msg()
            ),
            1621333154
        );
    }

    /**
     * @param array<mixed> $serializedValueObject
     * @return \JsonSerializable
     * @throws \InvalidArgumentException
     */
    public static function deserializeValueObject(array $serializedValueObject): \JsonSerializable
    {
        if (isset($serializedValueObject['__value_object_value']) && isset($serializedValueObject['__value_object_type'])) {
            return DenormalizingObjectConverter::convertFromSource(
                $serializedValueObject['__value_object_value'],
                $serializedValueObject['__value_object_type']
            );
        }

        throw new \InvalidArgumentException(
            '$serializedValueObject must contain keys "__value_object_value" and "__value_object_type"',
            1621332088
        );
    }
}
