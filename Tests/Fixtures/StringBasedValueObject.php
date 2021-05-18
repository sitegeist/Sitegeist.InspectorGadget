<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Tests\Fixtures;

final class StringBasedValueObject
{
    /**
     * @var string
     */
    private $value;

    /**
     * @param string $value
     */
    private function __construct(string $value)
    {
        $this->value = $value;
    }

    /**
     * @param string $string
     * @return self
     */
    public static function fromString(string $string): self
    {
        return new self($string);
    }

    /**
     * @return string
     */
    public function getValue(): string
    {
        return $this->value;
    }
}
